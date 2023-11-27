import React, { useEffect, useState } from 'react'
/*import { BrowserRouter, Routes, Route } from 'react-router-dom';
import login from "./components/login"
import { Router } from 'express';
import { Link } from 'react-router-dom';*/
import axios from 'axios';


function App() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://92.253.29.136:4462/users/getAllUsers')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });

    return () => { return false };
  }, []);


  return (
    <>

      {users.map(
        user =>
          <h3 key={user.id}>
            {user.name}
          </h3>
      )}
    </>
  )
}

export default App