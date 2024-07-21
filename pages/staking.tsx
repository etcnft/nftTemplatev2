import {
    ConnectWallet,
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useContractRead,
    useOwnedNFTs,
    useTokenBalance,
    Web3Button,
  } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFT/NFTCard";
import {
  NFT_ADDRESS,
  stakingContractAddress,
  tokenContractAddress,
} from "../const/contractAddresses";
import stylesHome from "../styles/Home.module.css";
import {abi} from '../const/abi'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";


  
  
  const Stake: NextPage = () => {
    const address = useAddress();
    const { contract: nftDropContract } = useContract(
        NFT_ADDRESS,
      "nft-drop"
    );
    
    const { contract: froggieContract, isLoading: loadingFroggie, error:errorLoadingFroggie } = useContract(NFT_ADDRESS,abi);

    const { contract: tokenContract } = useContract(
      tokenContractAddress,
      "token"
    );
    const { contract, isLoading } = useContract(stakingContractAddress);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [
      address,
    ]);
    
  

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await contract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[1]);
    }
    loadClaimableRewards();
  }, [address, contract]);
  
  async function stakeNft(id: string) {
    if (!address) return;

  const isApproved = await froggieContract?.call("isApprovedForAll", [address, stakingContractAddress]);

  const toastSuccess = () => {
      toast.success('STAKING SUCCESSFUL!!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  }
  const toastFail = () => {
      toast.success('STAKING FAILED!!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  }
  
    if (!isApproved) {
      console.log("Checking Approved")
      await froggieContract?.call("setApprovalForAll", [stakingContractAddress, true]);
    }
    const stake = await contract?.call("stake", [[id]]);
    if(stake){
      console.log("Staking Successful")
      toastSuccess();

    } else {
      console.log("Staking Failed")
      toastFail();
    }

  }
  
  
    if (isLoading) {
      return <div className={stylesHome.main}><div>Loading...</div></div>
      
      ;
    }
  
    return (

        <>
        <div className={stylesHome.main}>
        
                <div className={stylesHome.stakingContainer}>
                    <h1 className={stylesHome.h1}>STAKE YOUR NFT</h1>
                    <p style={{color:"gold", fontWeight:'bolder', fontSize:'large'}}>Rate: 4.2069 Token/NFT/Day</p>
                    {!address ? (
                        <ConnectWallet />
                    ) : (
                        <>
                            <h2>Your Token Rewards</h2>
                            <div className={stylesHome.tokenGrid}>
                                <div className={stylesHome.tokenContainer}>
                                    <div className={stylesHome.tokenItem}>
                                        <h3 className={stylesHome.tokenLabel}>Claimable Rewards</h3>
                                        <p className={stylesHome.tokenValue}>
                                            <b>
                                                {!claimableRewards
                                                    ? "Loading..."
                                                    : parseFloat(ethers.utils.formatUnits(claimableRewards, 18)).toFixed(4)}
                                            </b>{" "}
                                            {tokenBalance?.symbol}
                                        </p>
                                    </div>
                                    <div className={stylesHome.tokenItem}>
                                        <h3 className={stylesHome.tokenLabel}>Current Balance</h3>
                                        <p className={stylesHome.tokenValue}>
                                            <b>{typeof tokenBalance?.displayValue === 'string' ? parseFloat(tokenBalance.displayValue).toFixed(4) : 'N/A'}
                                            </b> {tokenBalance?.symbol}
                                        </p>
                                    </div>
                                </div>
                                <Web3Button
                                    action={async (contract) => {
                                        await contract.call("claimRewards");
                                        // Update claimable rewards state after claiming
                                        setClaimableRewards(ethers.BigNumber.from(0));

                                    }}
                                    contractAddress={stakingContractAddress}
                                    className={stylesHome.Web3Button}
                                >
                                    Claim Rewards
                                </Web3Button>

                            </div>


                            <hr className={`${stylesHome.divider} ${stylesHome.spacerTop}`} />
                            <h2>Your Staked NFTs</h2>
                            <div className={stylesHome.nftBoxGrid}>
                                {stakedTokens &&
                                    stakedTokens[0]?.map((stakedToken: BigNumber) => (
                                        <NFTCard
                                            tokenId={stakedToken.toNumber()}
                                            key={stakedToken.toString()} />
                                    ))}
                            </div>

                            <hr className={`${stylesHome.divider} ${stylesHome.spacerTop}`} />
                            <h2>Your Unstaked NFTs</h2>
                            <div className={stylesHome.nftBoxGrid}>
                                {ownedNfts?.map((nft) => (
                                    <div className={stylesHome.nftBox} key={nft.metadata.id.toString()}>
                                        <ThirdwebNftMedia
                                            metadata={nft.metadata}
                                            className={stylesHome.nftMedia} />
                                        <h3>{nft.metadata.name}</h3>
                                        <Web3Button
                                            contractAddress={stakingContractAddress}
                                            action={() => stakeNft(nft.metadata.id)}

                                            className={stylesHome.Web3Button}
                                        >
                                            Stake
                                        </Web3Button>


                                    </div>
                                ))}
                            </div>
                            <hr className={`${stylesHome.divider} ${stylesHome.spacerTop}`} />

                        </>
                    )}

                </div>
            </div>
            
            </>
      
    );
  };
  
  export default Stake;
  