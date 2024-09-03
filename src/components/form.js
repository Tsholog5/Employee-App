import React, { useState } from 'react';
import './form.css';

function Form() {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    gender: '',
    email: '',
    phone: '',
    image: '',
    position: '',
    id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);

  const validateInputs = () => {
    if (!newEmployee.name) return 'Name is required.';
    if (!newEmployee.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(newEmployee.email)) return 'Invalid email address.';
    if (!newEmployee.phone || !/^\d+$/.test(newEmployee.phone)) return 'Phone number should contain only digits.';
    if (!newEmployee.gender) return 'Gender is required.';
    if (!newEmployee.position) return 'Position is required.';
    if (!newEmployee.id || !/^\d{13}$/.test(newEmployee.id)) return 'ID should be exactly 13 digits.';
    return '';
  };

  const addEmployee = () => {
    const errorMsg = validateInputs();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    if (employees.some(employee => employee.id === newEmployee.id)) {
      alert('Duplicate detected.');
      return;
    }
    setEmployees([...employees, newEmployee]);
    resetForm();
    alert('Employee successfully added');
  };

  const resetForm = () => {
    setNewEmployee({
      name: '',
      gender: '',
      email: '',
      phone: '',
      image: '',
      position: '',
      id: ''
    });
    setIsEditing(false);
    setCurrentEmployeeId('');
    setError('');
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  const editEmployee = (employee) => {
    setNewEmployee(employee);
    setIsEditing(true);
    setCurrentEmployeeId(employee.id);
    setShowForm(true);
    setShowList(false);
  };

  const updateEmployee = () => {
    const errorMsg = validateInputs();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setEmployees(employees.map(employee => (employee.id === currentEmployeeId ? newEmployee : employee)));
    resetForm();
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  const handleSearch = () => {
    setFilteredEmployees(employees.filter(employee => employee.name.includes(searchQuery) || employee.id.includes(searchQuery)));
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowList(false);
  };

  const handleShowList = () => {
    setShowForm(false);
    setShowList(true);
  };

  const getGenderIcon = (gender) => {
    if (gender === 'male') {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpC650bxBEk2zBAQj64HdZ770dTVGbO_lm9A&s';
    } else if (gender === 'female') {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzVvc_1EbinQldCVFBX3uJ5vKe8LQP6CvhXA&s';
    }
    return null; 
  };

  return (
    <div className="app-container">
      <h1>Employee Management</h1>

      <div className="nav-buttons">
        <button className={`nav-button ${showForm ? 'active' : ''}`} onClick={handleShowForm}>Show Employee Form</button>
        <button className={`nav-button ${showList ? 'active' : ''}`} onClick={handleShowList}>Show Employee List</button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone number"
            value={newEmployee.phone}
            onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
          />
          <select
            value={newEmployee.gender}
            onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {newEmployee.gender && (
            <img src={getGenderIcon(newEmployee.gender)} alt={`${newEmployee.gender} Icon`} className="gender-icon" />
          )}
          <input
            type="text"
            placeholder="Position"
            value={newEmployee.position}
            onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
          />
          <input
            type="text"
            placeholder="ID"
            value={newEmployee.id}
            onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setNewEmployee({ ...newEmployee, image: URL.createObjectURL(e.target.files[0]) })}
          />
          {error && <p className="error">{error}</p>}
          <button className="form-button" onClick={handleSubmit}>{isEditing ? 'Update Employee' : 'Add Employee'}</button>
          {isEditing && <button className="form-button" onClick={resetForm}>Cancel</button>}
        </div>
      )}

      {showList && (
        <div className="list-container">
          <h2>Employee List</h2>
          <input
            type="text"
            placeholder="Search by ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          {employees.length === 0 ? (
            <p>No employees have been added.</p>
          ) : (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees
                  .filter(employee => employee.id.includes(searchQuery))
                  .map(employee => (
                    <tr key={employee.id}>
                      <td>
                        {employee.image && (
                          <img src={employee.image} alt="Employee" className="employee-image" />
                        )}
                      </td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.gender}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.position}</td>
                      <td>{employee.id}</td>
                      <td>
                        <button className="list-button" onClick={() => editEmployee(employee)}>Edit</button>
                        <button className="list-button" onClick={() => deleteEmployee(employee.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Form;
