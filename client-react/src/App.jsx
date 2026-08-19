import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import { Home } from './views/Home';
import { Leaderboard } from './views/Leaderboard';
import { Predictions } from './views/Predictions';
import { PredictSubmit } from './views/PredictSubmit';
import { Login } from './views/Login';
import { Signup } from './views/Signup';

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/predict" element={<PredictSubmit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
