import {
    ThirdwebNftMedia,
    useContract,
    useContractMetadata,
    useNFT,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { useState, type FC } from "react";
  import {
    NFT_ADDRESS,
    stakingContractAddress,
  } from "../../const/contractAddresses";
  import styles from "../../styles/Home.module.css";
  import { toast, ToastContainer } from 'react-toastify';
  import "react-toastify/dist/ReactToastify.css";
  
  
  interface NFTCardProps {
    tokenId: number;
  }
  
  const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
    const { contract } = useContract(NFT_ADDRESS);
    const { data: nft } = useNFT(contract, tokenId);
    const { data: metadata, isLoading: loadingMetadata } = useContractMetadata(contract);
    
    const showToastMessage = () => {
      toast.success('WITHDRAW SUCCESSFUL!!', {
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
    const showToastError = () => {
      toast.error('WITHDRAW FAILED!!', {
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

    return (
      <>
        {nft && (
          <div className={styles.nftBox}>
            
            {!loadingMetadata && nft.metadata &&
                <div>
                  <img className={styles.nftMedia} src={nft.metadata.image as string} alt="Froggie" />
  
                </div>
            }
            <h3 className={styles.h3}>{nft.metadata.name}</h3>
            <Web3Button
              action={(contract) => contract?.call("withdraw", [[nft.metadata.id]])}
              contractAddress={stakingContractAddress}
              className={styles.Web3Button}
              onSuccess={() => showToastMessage()}
              onError={() => showToastError()}
            >
              Withdraw
            </Web3Button>
          </div>
        )}
      </>
    );
  };
  export default NFTCard;

function UseState(nft: import("@thirdweb-dev/react").NFT | undefined, arg1: boolean): { loadedNFTs: any; loadingnfts: any; } {
  throw new Error("Function not implemented.");
}
  