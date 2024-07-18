import {
  ThirdwebNftMedia,
  useContract,
  useNFT,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "./NFT.module.css";

type Props = {
  nft: any;
  contract: string;
};


export default function NFTComponent({ nft, contract }: Props) {

  const { contract: NFTContract } = useContract(contract);
  // Load the NFT metadata from the contract using a hook
  const { data, isLoading, error } = useNFT(NFTContract, nft);


  // Render the NFT onto the UI
  if (isLoading) return <div>Loading...</div>;
  if (error || !nft) return <div>NFT not found</div>;


return (
    <>
      {data ? (
        <ThirdwebNftMedia metadata={data.metadata ?? {}} className={styles.nftImage} />
        ) : (
        // Render something else or nothing if data is undefined
        <div>Image Failed</div>
        )}
   
      <p className={styles.nftName}>{data?.metadata.name}</p>
      <p className={styles.nftName}>
        Ranking:  {data?.metadata.ranking as string}
      </p>    </>
  );
}
