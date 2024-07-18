import React, { useEffect, useState } from 'react';
import { useContract, useConnectionStatus, useAddress } from "@thirdweb-dev/react";
import { rewardsabi } from "../const/abi";
import Container from "../components/Container/Container";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { REWARDSADDRESS, title, description, welcome } from "../const/contractAddresses";
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Rewards() {
  const { contract } = useContract(REWARDSADDRESS, rewardsabi);
  const currentUserAddress = useAddress();

  console.log("USER: ", currentUserAddress)
  const connectionStatus = useConnectionStatus();
  const [totalUserClaimed, setTotalUserClaimed] = useState<string | null>(null);
  const [unclaimedRewards, setUnclaimedRewards] = useState<string | null>(null);
  
  const handleClaimRewards = async () => {
    if (contract) {
      try {
        const tx = await contract.call("ClaimAllRewards", [], { from: currentUserAddress });
        console.log("Claim transaction hash:", tx.hash);
        
        toast.success('🐸 CLAIM REWARD SUCCESSFUL!! \n Check Wallet for Rewards.', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  
        // Optionally, you can add logic to listen for transaction confirmation
      } catch (error: unknown) {
        console.error("Error claiming rewards:", error);
  
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
          const reasonMatch = error.message.match(/Reason: (.+?)(\n|$)/);
          if (reasonMatch) {
            errorMessage = reasonMatch[1];
          } else {
            errorMessage = error.message;
          }
        } else if (typeof error === 'string') {
          const reasonMatch = error.match(/Reason: (.+?)(\n|$)/);
          if (reasonMatch) {
            errorMessage = reasonMatch[1];
          } else {
            errorMessage = error;
          }
        }
  
        toast.error(`❌ CLAIM FAILED!! \n ${errorMessage}`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  useEffect(() => {
    const fetchContractData = async () => {
      if (contract) {
        try {

          // Fetch total user claimed (assuming current user's address is available)
          const userClaimed = await contract.call("UserTotalClaimed", [currentUserAddress]);
          const userClaimedInEth = ethers.utils.formatEther(userClaimed);
          console.log("Total User Claimed:", userClaimedInEth);
          setTotalUserClaimed(userClaimedInEth);

          // Fetch total unclaimed rewards for the user
          const unclaimed = await contract.call("GetTotalUnclaimed",[], { from: currentUserAddress });
          const unclaimedInEth = ethers.utils.formatEther(unclaimed);
          console.log("Unclaimed Rewards:", unclaimedInEth);
          setUnclaimedRewards(unclaimedInEth);
          
        } catch (error) {
          console.error("Error fetching contract data:", error);
        }
      }
    };
    fetchContractData();
  }, [contract]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />

      <Container maxWidth="lg">
        <div className={styles.main}>
          {connectionStatus === "connected" ? (
            <>
             
              <div className={styles.countdown}>
                <h2>Your Total Claimed Rewards: {totalUserClaimed} $ETC</h2>
                <h2>Your Total Unclaimed Rewards: {unclaimedRewards} $ETC</h2>
                <button className={styles.btn} onClick={handleClaimRewards}>Claim Rewards</button>

              </div>
            </>
          ) : (
            <section className={styles.container}>
              <div>
                <h2 id="welcomeH2">Connect to MetaMask to Get Started</h2>
                <h1 id="welcomeH1">{welcome}</h1>
              </div>
            </section>
          )}
        </div>
      </Container>
    </>
  );
}
