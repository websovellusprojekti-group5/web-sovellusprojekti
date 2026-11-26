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
import Profile from './pages/Profile'
import ProfileLists from './pages/ProfileLists'
import ProfileReviews from './pages/ProfileReviews'
import CreateGroup from './pages/CreateGroup'

function App() {

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            exact
            element={<Home />}
          />
          <Route
            path="/movies"
            exact
            element={<Movies />}
          />
          <Route
            path="/movies/:id"
            element={<MovieDetails />}
          />
          <Route
            path="/search"
            element={<Search />}
          />
          <Route
            path="/register"
            exact
            element={<Register />}
          />
          <Route
            path="/login"
            exact
            element={<Login />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/lists" element={<ProfileLists />} />
          <Route path="/profile/reviews" element={<ProfileReviews />} />
          <Route path="/groups/new" element={<CreateGroup />} />
        </Routes>
      </main>
    </>
  )
}

export default App
