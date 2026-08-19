// import { useState } from 'react'
// import './App.css'
import { Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import { Home } from './views/Home'
import { Leaderboard } from './views/Leaderboard'
import { Predictions } from './views/Predictions'
import { PredictSubmit } from './views/PredictSubmit'

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
        </Routes>
      </div>
    </>
  )
}

export default App
