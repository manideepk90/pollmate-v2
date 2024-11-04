import React from 'react'
import RegisterForm from '../components/forms/RegisterForm';
import NavBar from '../components/navigation/NavBar';

function page() {
  return (
    <div className="w-full min-h-dvh">
      <NavBar />
      <RegisterForm />
    </div>
  );
}

export default page