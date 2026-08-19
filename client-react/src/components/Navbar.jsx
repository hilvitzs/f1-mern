import { Link } from 'react-router';

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/predictions">Predictions</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/predict">Submit prediction</Link>
      <Link to="/login">Log In</Link>
    </nav>
  );
}
