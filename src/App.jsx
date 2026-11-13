import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Search from './pages/Search'
import Navbar from './components/Navbar/Navbar'
import Register from './pages/Register'
import Login from './pages/Login'
import Moviecard from './components/Moviecard/Moviecard'
import MovieDetails from './pages/MovieDetails'

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
          <Route
          path="/search"
          element={<Search/>}
          />
          <Route
          path="/register"
          exact
          element={<Register/>}
          />
          <Route
          path="/login"
          exact
          element={<Login/>}
          />

        </Routes>
      </main>
    </>
  )
}

export default App
