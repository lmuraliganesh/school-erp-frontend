import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";

interface User {    
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DashboardPageProps {
  token: string;
}

function DashboardPage({token}: DashboardPageProps){
  const [users, setUsers]= useState<User[]>([]);
  
  useEffect (() =>{
    const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  fetchUsers();
    }, [token]);

  return <Dashboard adminName="Admin" users={users} />;
}

export default DashboardPage