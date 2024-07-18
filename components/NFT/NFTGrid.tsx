import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import Link from "next/link";
import React, { useState } from "react";
import Skeleton from "../Skeleton/Skeleton";
import NFT from "./NFT";
import styles from "../../styles/Buy.module.css";

type Props = {
  isLoading: boolean;
  data: NFTType[] | undefined;
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
  contract: string,
};

export default function NFTGrid({
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
        {[...Array(20)].map((_, index) => (
          <div key={index} className={styles.nftContainer}>
            <Skeleton key={index} width={"130px"} height="150px" />
          </div>
        ))}
      </div>
    );
  }

  console.log("NFT: ", data)
  // Filter out NFTs without metadata or with id equal to 0
  const filteredData = data.filter(
    (nft) => nft.metadata && nft.metadata.id !== "0"
  );

  // Check if there are NFTs with metadata
  if (filteredData.length === 0) {
    return <p>{emptyText}</p>;
  }
  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === 'ranking') {
      return (
        (parseInt(String(a.metadata.ranking), 10) || 0) -
        (parseInt(String(b.metadata.ranking), 10) || 0)
      );
    } else if (sortOrder === 'id') {
      return parseInt(a.metadata.id, 10) - parseInt(b.metadata.id, 10);
    }
  
    // Default case
    return 0;
  });

  return (
<div>

  <div className={styles.sortButtons}>
        <button
          className={sortOrder === 'ranking' ? styles.activeButton : ''}
          onClick={() => setSortOrder('ranking')}>
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
    {sortedData.map((nft) =>
      !overrideOnclickBehavior ? (
        <Link
          href={`/token/${contract}/${nft.metadata.id}`}
          key={nft.metadata.id}
          className={styles.nftContainer}
        >
          <NFT nft={nft} contract={contract} />
        </Link>
      ) : (
        <div
          key={nft.metadata.id}
          className={styles.nftContainer}
          onClick={() => overrideOnclickBehavior(nft)}
        >
          <NFT nft={nft} contract={contract} />
        </div>
      )
    )}
  </div>
  </div>

  );
}
