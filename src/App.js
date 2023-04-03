import './App.css';
import Marketplace from './components/Marketplace.js';
import Profile from './components/Profile.js';
import SellNFT from './components/SellNFT.js';
import NFTPage from './components/NFTpage.js';
import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/nftPage" element={<NFTPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sellNFT" element={<SellNFT />} />
      </Routes>
    </div>
  );
}

export default App;
