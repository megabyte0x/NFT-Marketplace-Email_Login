import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SellNFT from './components/SellNFT.js';
import Marketplace from './components/Marketplace.js';
import Profile from './components/Profile.js';
import NFTPage from './components/NFTpage.js';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/sellNFT" element={<SellNFT />} />
        <Route path="/nftPage/:tokenId" element={<NFTPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
