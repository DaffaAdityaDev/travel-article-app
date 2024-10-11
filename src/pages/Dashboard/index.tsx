import React from 'react'
import Welcome from '../../components/Welcome'

function index() {
  console.log(localStorage.getItem('authToken'));
  return (
    <div>
      <Welcome/>
      <h1>Dashboard</h1>
    </div>
  )
}

export default index