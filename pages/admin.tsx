import { Web3Button, useConnectionStatus, useContract, useContractWrite } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import Head from "next/head";
import { abi } from "../const/abi"; // Import the contract ABI
import { NFT_ADDRESS, title, description, welcome } from "../const/contractAddresses";
import MintContainer from "../components/Mint/MintContainer"; // Adjust the import path
import { useEffect, useState } from "react";
import Web3 from "web3";


const ADMIN: NextPage = () => {

  const { contract, isLoading, error } = useContract(NFT_ADDRESS,abi);
  const connectionStatus = useConnectionStatus();
  const [etcBalance, setEtcBalance] = useState<number | null>(null);
  // State for airdrop recipient
  const [recipient, setRecipient] = useState<string>("");


  useEffect(() => {
    const fetchEtcBalance = async () => {
      try {
        // Check if Web3 is available
        if (window.ethereum) {
          // Initialize Web3 with the current provider
          const web3 = new Web3(window.ethereum);

         
          const selectedAddress = NFT_ADDRESS;

          // Get the balance in Wei
          const balanceWei = await web3.eth.getBalance(selectedAddress);

          // Convert Wei to ETC
          const balanceEtc = parseFloat(web3.utils.fromWei(balanceWei, 'ether'));
          setEtcBalance(balanceEtc);
        }
      } catch (error) {
        console.error("Error fetching ETC balance:", error);
      }
    };

    // Fetch ETC balance when component mounts
    if (connectionStatus === "connected") {
      fetchEtcBalance();
    }
  }, [connectionStatus]);
  return (

    <>
    <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="images/x-icon/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="images/x-icon/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="images/x-icon/favicon-16x16.png"/>
        <link rel="manifest" href="images/x-icon/site.webmanifest"/>
    </Head>
  

    <section className={styles.main}>
        {connectionStatus === "connected" ? (
          /* Render content when connected */
          <div className={styles.section}>
            

            {/* Airdrop Section */}
            <div className={styles.countdown}>
              <h3>Airdrop Tokens</h3>
              <input
                className={styles.inputField}
                type="text"
                placeholder="Recipient"
                onChange={(e) => setRecipient(e.target.value)}
              />
              
              <Web3Button
                contractAddress={NFT_ADDRESS}
                action={async (contract) => {
                  await contract?.call("Airdrop", [recipient]);
                }}
              >
                Airdrop
              </Web3Button>
            </div>

            

      
          </div>
        ) : (
          /* Render content when not connected */
          <section className={styles.container}>
            <div>
              <h2 id="welcomeH2">Connect to MetaMask to Get Started</h2>
              <h1 id="welcomeH1">Welcome to the Froggies</h1>
            </div>
          </section>
        )}
      </section>
    </>
  );
};

export default ADMIN;
