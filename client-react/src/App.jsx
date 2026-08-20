import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import { Home } from './views/Home';
import { Leaderboard } from './views/Leaderboard';
import { Predictions } from './views/Predictions';
import { PredictSubmit } from './views/PredictSubmit';
import { Login } from './views/Login';
import { Signup } from './views/Signup';
import { AuthWrapper } from './components/AuthWrapper';

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/predictions"
            element={
              <AuthWrapper>
                <Predictions />
              </AuthWrapper>
            }
          />
          <Route
            path="/predict"
            element={
              <AuthWrapper>
                <PredictSubmit />
              </AuthWrapper>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
