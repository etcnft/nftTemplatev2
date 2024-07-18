import { useContract, useNFT } from "@thirdweb-dev/react";
import { DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";
import Link from "next/link";
import React from "react";
import styles from "../../styles/Buy.module.css";
import NFT from "../NFT/NFT";
import Skeleton from "../Skeleton/Skeleton";

type Props = {
  listing: DirectListingV3 | EnglishAuction;
  contract: string;
};

/**
 * Accepts a listing and renders the associated NFT for it
 */

export default function ListingWrapper({ listing, contract }: Props) {
  const { contract: nftContract } = useContract(contract);

  const { data: nft, isLoading } = useNFT(nftContract, listing.asset.id);

  if (isLoading) {
    return (
      <div className={styles.nftContainer}>
        <Skeleton width={"100%"} height="200px" />
      </div>
    );
  }

  if (!nft) return null;

  return (
    <Link
      href={`/token/${contract}/${nft.metadata.id}`}
      key={nft.metadata.id}
      className={styles.nftContainer}
    >
      <NFT nft={nft} contract={contract}/>
    </Link>
  );
}
