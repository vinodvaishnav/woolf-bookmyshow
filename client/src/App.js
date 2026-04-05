import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movie from './pages/Movie';
import UserLockout from './components/UserLockout';
import Show from './pages/Show';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path='/movie/:id' element={<Movie />} />
        <Route path='/show/:showId' element={<Show />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Register />} />
        <Route path='test' element={<UserLockout><div>Test</div></UserLockout>} />
        <Route path='*' element={<h1>404</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
