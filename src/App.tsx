import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NotFound from './components/NotFound';
const Crosswordle = React.lazy(() => import('./components/crosswordle'));
const Archive = React.lazy(() => import('./components/archive/Archive'));

const App : React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Crosswordle />} />
        <Route path='/puzzles' element={<Archive />} />
        <Route path='/puzzles/:crosswordNumber' element={<Crosswordle />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
