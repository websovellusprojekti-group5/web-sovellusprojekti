import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Navbar from './components/Navbar/Navbar'
import Moviecard from './components/Moviecard/Moviecard'

function App() {
  
  return(
    <>
    <Navbar/>  
      <main>
        <Routes>
          <Route
          path="/"
          exact
          element={<Home/>}
          />
          <Route
          path="/movies"
          exact
          element={<Movies/>}
          />
        </Routes>
      </main>
    </>
  )
}

export default App
