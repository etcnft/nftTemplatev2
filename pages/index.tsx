import { ThirdwebNftMedia, useConnectionStatus, useContract, useContractRead, useNFT } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import Head from "next/head";
import { abi } from "../const/abi"; // Import the contract ABI
import { NFT_ADDRESS, title, description, welcome } from "../const/contractAddresses";
import MintContainer from "../components/Mint/MintContainer"; // Adjust the import path
import { useEffect, useState } from "react";
import { NFT } from "@thirdweb-dev/sdk";

const Home: NextPage = () => {

  const { contract, isLoading, error } = useContract(NFT_ADDRESS,abi);
  const connectionStatus = useConnectionStatus();

 // Inside your Home component
  const [tokenToCheck, setTokenToCheck] = useState('');
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [tokenOwner, setTokenOwner] = useState('');
  const [tokenCheckError, setTokenCheckError] = useState('');

  // Function to handle token check
  const handleTokenCheck = async () => {
    console.log("Checking NFT: ", tokenToCheck)
    if (!tokenToCheck) {
      console.log("Enter Token ID")
      setTokenCheckError('Please enter a token ID');
      return;
    }

    try {
      console.log("Trying NFT")
      const data = await contract?.call("ownerOf", [tokenToCheck])
      console.log("Data", data);
      const lastFourCharacters = '...' + data.slice(-4);
      setTokenOwner(lastFourCharacters);
      setIsTokenChecked(true);
      setTokenCheckError('');
    

    } catch (error) {
      setTokenCheckError('Token not minted');
      setIsTokenChecked(false);
      setTokenOwner('');

    }
  };


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
            
            <div className={styles.countdown} id="countdown" >
              <MintContainer contract={contract} isLoading={isLoading} error={error}/>
            </div>

            <div id="minted-container" className={`${styles.countdown} ${styles.hidden}`}>
              <h2>Minted!</h2>
              <p>Here&aposs your transaction link:</p>
              <a id="mintedTxnBtn" href="" target="_blank" rel="noopener noreferrer">
                <button className={`${styles.herobtn} ${styles.btn}`}>View Transaction</button>
              </a>
              <p>View it in the collection:</p>
              <a
                id="mintedLinkBtn"
                href="wallet.html"
                rel="noopener noreferrer"
              >
                <button className={`${styles.herobtn} ${styles.btn}`}>View Collection</button>
              </a>
            </div>

            <div className={styles.countdown} >

              <div className={styles.tokenCheck}>
                <h2>Check if NFT is Minted</h2>
                <input
                  type="text"
                  value={tokenToCheck}
                  onChange={(e) => setTokenToCheck(e.target.value)}
                  placeholder="Enter NFT Token ID"
                />
                <button className={`${styles.herobtn} ${styles.btn}`} onClick={handleTokenCheck}>Check</button>
                {tokenCheckError && <p className={styles.error}>{tokenCheckError}</p>}
                {isTokenChecked && (
                  <><p>
                    {tokenToCheck} is minted
                  </p>
                  <p> Owner {tokenOwner}</p>
                  </>
                )}
              </div>
            </div>

      
          </div>
        ) : (
          /* Render content when not connected */
          <section className={styles.container}>
            <div>
              <h2 id="welcomeH2">Connect to MetaMask to Get Started</h2>
              <h1 id="welcomeH1">{welcome}</h1>
            </div>
          </section>
        )}
      </section>
    </>
  );
};

export default Home;
