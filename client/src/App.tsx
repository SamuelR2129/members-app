import { Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Tables from './pages/Tables';
import Contractors from './pages/Contractors';
import Navbar from './components/Navbar';
import { SWRConfig } from 'swr';
import axios from 'axios';

function App() {
  const location = useLocation();
  const previousLocation = location.state?.previousLocation;
  return (
    <>
      <SWRConfig
        value={{
          fetcher: (url: string) => axios.get(url).then((res) => res.data)
        }}>
        <Navbar />
        <Routes location={previousLocation || location}>
          <Route path="/" element={<MainPage />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/contractors" element={<Contractors />} />
        </Routes>
      </SWRConfig>
    </>
  );
}

export default App;
