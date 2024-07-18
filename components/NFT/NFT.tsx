import {
  ThirdwebNftMedia,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React, { useEffect, useState } from "react";
import styles from "./NFT.module.css";


type Props = {
  nft: NFT;
  contract: string;
};
const fetchRarityRanking = async (tokenId: any) => {
  const response = await fetch('/rarity.json'); // Path to the file in the public directory
  const data = await response.json();
  
  const nftData = data.find((nft: { id: any; }) => nft.id === tokenId);
  return nftData ? nftData.rank : null;
};

export default function NFTComponent({ nft }: Props) {
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    const getRanking = async () => {
      const ranking = await fetchRarityRanking(nft.metadata.id);
      setRanking(ranking);
    };
    getRanking();
  }, [nft]);

return (
    <>
      <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftImage} />
      
   
      <p className={styles.nftName}>{nft.metadata.name}</p>
      <p className={styles.nftName}>
        Ranking: {ranking !== null ? ranking : 'Loading...'}
      </p>   
        </>
  );
}
