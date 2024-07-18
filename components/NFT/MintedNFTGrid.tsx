import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import Link from "next/link";
import React, { useState } from "react";
import Skeleton from "../Skeleton/Skeleton";
import NFT from "./MintedNFT";
import styles from "../../styles/Buy.module.css";
import metadata from "../../const/metadata.json"

type Props = {
  isLoading: boolean;
  data: string[] | undefined;
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
  contract: string,
};

export default function MintedNFTGrid({
  isLoading,
  data,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
  contract
}: Props) {


  const [sortOrder, setSortOrder] = useState<'ranking' | 'id'>('ranking');
  
  // Check if data is not available
  if (isLoading || !data) {
    return (
      <div className={styles.nftGridContainer}>
        {[...Array(12)].map((_, index) => (
          <div key={index} className={styles.nftContainer}>
            <Skeleton key={index} width={"130px"} height="150px" />
          </div>
        ))}
      </div>
    );
  }
  const parsedData = data.map((nftString) => JSON.parse(nftString));

  const sortedData = parsedData.sort((a, b) => {
    if (sortOrder === 'ranking') {
      return (
        (parseInt(String(a.ranking), 10) || 0) -
        (parseInt(String(b.ranking), 10) || 0)
      );
    } else if (sortOrder === 'id') {
      return parseInt(a.id, 10) - parseInt(b.id, 10);
    }
    // Default case
    return 0;
  });

  return (

<div>
  <div className={styles.sortButtons}>
        <button
          className={sortOrder === 'ranking' ? styles.activeButton : ''}
          onClick={() => setSortOrder('ranking')}
        >
          Sort by Ranking
        </button>
        <button
          className={sortOrder === 'id' ? styles.activeButton : ''}
          onClick={() => setSortOrder('id')}
        >
          Sort by ID
        </button>
      </div>

      <div className={styles.nftGridContainer}>
        {sortedData.map((nft) => (
          <Link
            href={`/token/${contract}/${nft}`}
            key={nft}
            className={styles.nftContainer}
          >test
            <NFT nft={nft} contract={contract} />
          </Link>
        ))}
      </div>
  </div>

  );
}
