import { useState, useEffect } from "react";

const EMP_KEY = "employees";

const useEmployees = () => {
  const [employees, setEmployees] = useState(() => {
    // Load from localStorage immediately on hook initialization
    const savedEmployees = localStorage.getItem(EMP_KEY);
    if (savedEmployees) {
      try {
        return JSON.parse(savedEmployees);
      } catch (error) {
        console.error("Error parsing employees from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever employees change
  useEffect(() => {
    console.log("Saving employees to localStorage:", employees);
    localStorage.setItem(EMP_KEY, JSON.stringify(employees));
  }, [employees]);

  // Load employees from localStorage on mount (as backup)
  useEffect(() => {
    const savedEmployees = localStorage.getItem(EMP_KEY);
    if (savedEmployees && !employees.length) {
      try {
        const parsed = JSON.parse(savedEmployees);
        if (parsed.length > 0 && !employees.length) {
          setEmployees(parsed);
        }
      } catch (error) {
        console.error("Error parsing employees from localStorage:", error);
      }
    } else if (!savedEmployees && !employees.length) {
      // Initialize with mock data only if localStorage is empty
      const mockEmployees = [
        {
          id: 1,
          fullName: "John Doe",
          email: "john.doe@company.com",
          position: "Senior Developer",
          department: "Engineering",
          hireDate: "2023-01-15",
          isActive: true,
          gender: "Male",
          state: "California",
          phone: "+1234567890",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        {
          id: 2,
          fullName: "Jane Smith",
          email: "jane.smith@company.com",
          position: "Marketing Manager",
          department: "Marketing",
          hireDate: "2023-03-10",
          isActive: true,
          gender: "Female",
          state: "New York",
          phone: "+1234567891",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
        {
          id: 3,
          fullName: "Bob Johnson",
          email: "bob.johnson@company.com",
          position: "Sales Executive",
          department: "Sales",
          hireDate: "2023-06-22",
          isActive: false,
          gender: "Male",
          state: "Texas",
          phone: "+1234567892",
          avatar: "https://i.pravatar.cc/150?img=3",
        }
      ];
      setEmployees(mockEmployees);
    }
  }, []);

  const addEmployee = (employeeData) => {
    const newId = employees.length > 0 
      ? Math.max(...employees.map(e => e.id)) + 1 
      : 1;
    
    const newEmployee = {
      ...employeeData,
      id: newId,
      hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0],
      isActive: employeeData.isActive !== undefined ? employeeData.isActive : true,
    };
    
    console.log("Adding new employee:", newEmployee);
    
    setEmployees(prev => {
      const updated = [...prev, newEmployee];
      console.log("Updated employees list:", updated);
      return updated;
    });
    
    return newEmployee;
  };

  const updateEmployee = (updatedData) => {
    console.log("Updating employee:", updatedData);
    
    setEmployees(prev => {
      const updated = prev.map(emp => 
        emp.id === updatedData.id ? { ...emp, ...updatedData } : emp
      );
      console.log("After update employees list:", updated);
      return updated;
    });
  };

  const deleteEmployee = (id) => {
    console.log("Deleting employee with id:", id);
    
    setEmployees(prev => {
      const updated = prev.filter(emp => emp.id !== id);
      console.log("After delete employees list:", updated);
      return updated;
    });
  };

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  };
};

export default useEmployees;