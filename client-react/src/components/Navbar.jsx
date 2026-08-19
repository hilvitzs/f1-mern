import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const isLoggedIn = !!authStore.token;

  function logout() {
    authStore.logout();
    navigate('/login');
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      {isLoggedIn && (
        <>
          <Link to="/predictions">Predictions</Link>
          <Link to="/predict">Submit prediction</Link>
          <button onClick={logout}>Log Out</button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
