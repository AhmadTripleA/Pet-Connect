import React, { useEffect, useState } from 'react'
/*import { BrowserRouter, Routes, Route } from 'react-router-dom';
import login from "./components/login"
import { Router } from 'express';
import { Link } from 'react-router-dom';*/
import SignUpForm from "./components/SignUpForm"

function App() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
    return () => { return false }
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      console.log(users)
    }

  }, [users])

  return (
    <>
      <SignUpForm />
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