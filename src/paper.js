/**
 * @notice This module imports the PaperEmbeddedWalletSdk from the "@paperxyz/embedded-wallet-service-sdk" package.
 */
import { PaperEmbeddedWalletSdk } from "@paperxyz/embedded-wallet-service-sdk";

import { UserStatus } from "@paperxyz/embedded-wallet-service-sdk";


/**
 * @notice This constant initializes an instance of PaperEmbeddedWalletSdk with the provided configuration.
 */
export const sdk = new PaperEmbeddedWalletSdk({
  clientId: process.env.REACT_APP_PAPER_SECRET,
  chain: "Mumbai",
});

/**
 * @notice This function initiates the social login process using the Paper login modal.
 * @dev If there is an error during the process, it will be logged to the console.
 */
export const socialLogin = async () => {
  try {
    await sdk.auth.loginWithPaperModal();
    return sdk.getUser();
  } catch (e) {
    console.log(e);
  }
}

/**
 * @notice This function initiates the social logout process.
 * @dev If there is an error during the process, it will be logged to the console.
*/
export const socialLogout = async () => {
  try {
    await sdk.auth.logout();
  } catch (e) {
    console.log(e);
  }
}

/**
 * @notice This function retrieves the authenticated user's information.
 * @return {Promise} Returns a promise that resolves to the user object.
 */
export const getUser = async () => {
  const user = await sdk.getUser();
  return user;
}

/**
 * @notice This function retrieves the authenticated user's signer object from their wallet.
 * @dev If there is an error during the process, it will be logged to the console.
 * @return {Promise} Returns a promise that resolves to the signer object.
 */
export const getSigner = async () => {
  let signer;
  const user = await getUser();
  if (user.status === UserStatus.LOGGED_OUT) {
    return;
  }
  try {
    signer = await getUser().then((user) => {
      return user.wallet.getEthersJsSigner();
    });
  } catch (e) {
    console.log(e);
  }
  return signer;
}
