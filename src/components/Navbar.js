import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import { socialLogin, socialLogout, getUser } from "../paper.js";

import { UserStatus } from "@paperxyz/embedded-wallet-service-sdk";

/**
 * @notice Navbar component for displaying the navigation menu.
 * @return {JSX.Element} Returns the JSX element containing the Navbar component.
 */
function Navbar() {

  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currentAddress, updateAddress] = useState('0x');
  const [currentUser, updateUser] = useState(null);

  /**
   * @notice This function updates the button style when a user is connected.
   */
  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
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
        if (UserStatus.LOGGED_IN_WALLET_INITIALIZED === user.status) {
          setUser();
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function logout() {
    try {
      await socialLogout().then(() => {
        setUser();
      });
    } catch (error) {
      console.log(error);
    };
  }

  async function setUser() {
    try {
      await getUser().then((user) => {
        if (user.status === UserStatus.LOGGED_OUT) {
          toggleConnect(false);
          updateUser(null);
          updateAddress('0x');
          return;
        }
        updateUser(user);
        updateAddress(user.walletAddress);
        toggleConnect(true);
        updateButton();
      })
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @notice useEffect hook for checking the user's connection status.
   */
  useEffect(() => {

    setUser();

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
                <br></br>
                {connected && <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={logout}>Logout</button>}
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-10 text-sm'>
        {currentAddress !== "0x" ? "Connected to" : "Not Connected. Please login to view NFTs"} {currentAddress !== "0x" ? currentAddress : ""}
      </div>
    </div>
  );
}

export default Navbar;