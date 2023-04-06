import axios from "axios";
import { useParams } from 'react-router-dom';
import { useState } from "react";
import { ethers } from "ethers";

import Navbar from "./Navbar.js";

import { getSigner, getUser } from "../paper.js";

import MarketplaceJSON from "../Marketplace.json";


/**
 * @notice NFTPage component for displaying the details of a specific NFT.
 * @param {Object} props - Properties passed to the component.
 * @return {JSX.Element} Returns the JSX element containing the NFTPage component.
 */
export default function NFTPage(props) {

    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");
    const [recieverAddress, updateRecieverAddress] = useState("0x");

    /**
     * @notice This function retrieves the NFT data for the given tokenId.
     * @param {string} tokenId - The token ID of the NFT.
     */
    async function getNFTData(tokenId) {
        const signer = await getSigner();
        const user = await getUser();

        const addr = await user.walletAddress;
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        updateData(item);
        updateDataFetched(true);
        updateCurrAddress(addr);
    }

    /**
     * @notice This function handles buying an NFT.
     * @param {string} tokenId - The token ID of the NFT.
     */
    async function buyNFT(tokenId) {
        try {
            const signer = await getSigner();

            updateMessage("Buying the NFT... Please Wait (Upto 1 min)")

            const funcInterface = new ethers.utils.Interface(["function executeSale(uint256 tokenId) public"]);
            const dataToSend = funcInterface.encodeFunctionData("executeSale", [tokenId]);

            let tx = {
                to: MarketplaceJSON.address,
                value: ethers.utils.parseEther(data.price),
                data: dataToSend
            };
            const txResponse = await signer.sendTransaction(tx);
            const txReceipt = await txResponse.wait();
            console.log("Transaction sent:", txReceipt.transactionHash);

            alert('You successfully bought the NFT!');
            updateMessage("");
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }

    /**
     * @notice This function handles transferring an NFT to another address.
     * @param {string} tokenId - The token ID of the NFT.
     */
    async function transferNFT(tokenId) {
        try {

            const signer = await getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

            updateMessage("Transferring the NFT... Please Wait (Upto 1 min)")
            //run the executeSale function
            let transaction = await contract.transferNFT(tokenId, recieverAddress);
            await transaction.wait();

            alert('You successfully transferred the NFT!');
            updateMessage("");
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);

    return (
        <div style={{ "min-height": "100vh" }}>
            <Navbar></Navbar>
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: <span className="">{data.price + " Matic"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                        {currAddress === data.owner || currAddress === data.seller ?
                            <div className="text-emerald-700">
                                You are the owner of this NFT
                                <br></br>
                                <input type="text" placeholder="Enter the address of the buyer" className="bg-gray-800 text-white rounded-lg p-2 mt-2"
                                    onChange={(e) => updateRecieverAddress(e.target.value)}
                                ></input>
                                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => transferNFT(tokenId)}>Transfer this NFT
                                </button>
                            </div>


                            :
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>

                        }

                        <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}