import { useAddress, useConnectionStatus, useContract, useContractWrite } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import Head from "next/head";
import { abi } from "../const/abi"; // Import the contract ABI
import { NFT_ADDRESS, title, description, welcome } from "../const/contractAddresses";
import ClaimContainer from "../components/Mint/ClaimContainer"; // Adjust the import path

const Home: NextPage = () => {

  const { contract, isLoading, error } = useContract(NFT_ADDRESS,abi);
  const connectionStatus = useConnectionStatus();
  const currentUserAddress = useAddress();

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

              <ClaimContainer contract={contract} isLoading={isLoading} error={error}/>
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
