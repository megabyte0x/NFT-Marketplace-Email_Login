import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { socialLogin, getUser } from "../paper.js";

/**
 * @notice Navbar component for displaying the navigation menu.
 * @return {JSX.Element} Returns the JSX element containing the Navbar component.
 */
function Navbar() {

  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState('0x');
  const [currentUser, updateUser] = useState();

  /**
   * @notice This function updates the button style when a user is connected.
   */
  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  /**
  * @notice This function connects the user to Paper Wallet.
  * @dev If there is an error during the process, it will be logged to the console.
  */
  async function connectWithPaperWallet() {
    try {
      await socialLogin().then((user) => {
        if (user) {
          updateUser(user);
          updateAddress(user.walletAddress);
          updateButton();

        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * @notice useEffect hook for checking the user's connection status.
   */
  useEffect(() => {

    getUser().then((user) => {
      if (user) {
        updateUser(user);
        updateAddress(user.walletAddress);
        updateButton();
      }
    });

  }, [currentUser]);

  return (
    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
              <div className='inline-block font-bold text-xl ml-2'>
                NFT Marketplace
              </div>
            </Link>
          </li>
          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
              {location.pathname === "/" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/">Marketplace</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/">Marketplace</Link>
                </li>
              }
              {location.pathname === "/sellNFT" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/sellNFT">List My NFT</Link>
                </li>
              }
              {location.pathname === "/profile" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/profile">Profile</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/profile">Profile</Link>
                </li>
              }
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWithPaperWallet}>{connected ? "Connected" : "Connect Wallet"}</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-10 text-sm'>
        {currAddress !== "0x" ? "Connected to" : "Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? currAddress : ""}
      </div>
    </div>
  );
}

export default Navbar;