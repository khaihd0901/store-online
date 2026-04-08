import { useAuthStore } from '@/stores/authStore';
import React from 'react'
import { Link } from 'react-router';

const Header = () => {
  const { authSignOut } = useAuthStore();
  const handleLogOut = () => {
    authSignOut();
  };
  return (
    <>
    <div className='flex justify-between items-center'>
      <h1>header</h1>
      <button onClick={handleLogOut}>Logout</button>
      <Link to="/login">Login</Link>

    </div>
    </>
  )
}

export default Header