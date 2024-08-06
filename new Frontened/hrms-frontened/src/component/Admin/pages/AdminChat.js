import React, { useState, useEffect } from 'react';

import EmployeeChat from '../../User/UI/EmployeeChat';
import useAxios from '../../../hooks/useAxios';
const AdminChat = ({ adminId }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const axiosInstance = useAxios()
    useEffect(() => {
       
            axiosInstance.get("/api/employees").then(
             (res)=>{
              setEmployees(res.data.results);
             }
            )
            
        
    }, []);

    console.log("this is my employee data",employees)
    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
    };

    return (
        <div style={{marginLeft:`260px`}}>
            <h1>Admin Panel</h1>
            <div className="employee-list">
                <h2>Employees</h2>
                <ul>
                    {employees.map(employee => (
                        <li key={employee.id} onClick={() => handleEmployeeSelect(employee)}>
                            {employee.username}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedEmployee && (
                <EmployeeChat recipientId={selectedEmployee.id} />
            )}
        </div>
    );
};

export default AdminChat;
