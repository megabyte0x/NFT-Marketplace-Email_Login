import axios from "axios";
import { useState } from "react";
import { ethers } from "ethers";

import Navbar from "./Navbar.js";
import NFTTile from "./NFTTile.js";

import { getSigner } from "../paper.js";

import MarketplaceJSON from "../Marketplace.json";

const axiosInstance = axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/https://gateway.pinata.cloud',
});


/**
 * @notice Marketplace component displays a list of NFTs available for sale.
 * @return {JSX.Element} Returns the JSX element containing the Marketplace component.
 */
export default function Marketplace() {
    const sampleData = [
        {
            "name": "NFT#1",
            "description": "Megabyte's First NFT",
            "website": "https://megabyte0x.arweave.dev/",
            "image": "https://gateway.pinata.cloud/ipfs/QmZkN8R6H19knv9XDekdeRVN7nnnAyAbaMWzMveKpGnXGu",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xa60f738a60BCA515Ac529b7335EC7CB2eE3891d2",
        },
        {
            "name": "NFT#2",
            "description": "Megabyte's Second NFT",
            "website": "https://megabyte0x.arweave.dev/",
            "image": "https://gateway.pinata.cloud/ipfs/QmZkN8R6H19knv9XDekdeRVN7nnnAyAbaMWzMveKpGnXGu",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xa60f738a60BCA515Ac529b7335EC7CB2eE3891d2",
        },
        {
            "name": "NFT#3",
            "description": "Megabyte's Third NFT",
            "website": "https://megabyte0x.arweave.dev/",
            "image": "https://gateway.pinata.cloud/ipfs/QmZkN8R6H19knv9XDekdeRVN7nnnAyAbaMWzMveKpGnXGu",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xa60f738a60BCA515Ac529b7335EC7CB2eE3891d2",
        },
    ];
    const [data, updateData] = useState(sampleData);
    const [dataFetched, updateFetched] = useState(false);

    /**
    * @notice This function fetches all available NFTs from the smart contract.
    * @dev If the data is not fetched yet, this function is called.
    */
    async function getAllNFTs() {
        const signer = await getSigner();
        //Pull the deployed contract instance

        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getAllNFTs()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            // fetching image with cors proxy
            let meta = await axiosInstance.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            return item;
        }))

        updateFetched(true);
        updateData(items);
    }

    if (!dataFetched)
        getAllNFTs();

    return (
        <div>
            <Navbar></Navbar>
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    Top NFTs
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
            </div>
        </div>
    );

}