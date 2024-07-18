import {
  NFTContract,
    ThirdwebNftMedia,
    useAddress,
    useConnectionStatus,
    useContract,
    useContractRead,
    useNFTs,
    useOwnedNFTs,
    useTotalCirculatingSupply,
  } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "../components/Container/Container";
import MintedNFTGrid from "../components/NFT/MintedNFTGrid";
import { NFT_ADDRESS} from "../const/contractAddresses";
import styles from "../styles/Profile.module.css";
import { NFT as NFTType, ThirdwebSDK } from "@thirdweb-dev/sdk";   
import tokenPageStyles from "../styles/Token.module.css";
import { Flex, SimpleGrid , Text} from "@chakra-ui/react";
import { abi } from "../const/abi"; // Import the contract ABI
import NFT from "../components/NFT/MintedNFT";
import {
  MARKETPLACE_ADDRESS,
  NETWORK,
} from "../const/contractAddresses";
import NFTGrid from "../components/NFT/NFTGrid";

const NFTcontract = "0x5b2e0227d4Fd0F5b091663A8abD275952586d311"

const burnAddres = "0x000000000000000000000000000000000000dEaD"



export default function BurnedPage() {

  const { contract, isLoading } = useContract(NFTcontract);

  const { data: burnedNFTS, isLoading: loadingBurnedNfts } = useOwnedNFTs(
    contract,
    burnAddres
  );

  const totalBurned = burnedNFTS?.length;
 
  const [selectedNft, setSelectedNft] = useState<NFTType>();


    return (
      <Container maxWidth="lg">

        <div
          className={styles.activeTabContent}
        >
          <div className={styles.data}>
            <h3>
                Burned Dawgs
            </h3>
            <h3>
                Total Burned = {totalBurned}
            </h3>
            
          </div>
          <div>
            {!selectedNft ? (
                <>
                  <NFTGrid
                    data={burnedNFTS}
                    isLoading={loadingBurnedNfts}
                    contract={NFT_ADDRESS as string}
                    overrideOnclickBehavior={(nft) => {
                      setSelectedNft(nft);
                    }}
                    emptyText={`Looks like you don't own any NFTs in the collection. Head to the buy page to buy some!`}
                  />
                </>
              ) : null}
            </div>
            
  
          {/* Render the detailed NFT information outside of the loop */}
          {selectedNft && (
            <div className={tokenPageStyles.container} style={{ marginTop: 0 }}>
              <div className={tokenPageStyles.metadataContainer}>
                <div className={tokenPageStyles.imageContainer}>
                  <ThirdwebNftMedia
                    metadata={selectedNft.metadata}
                    className={tokenPageStyles.image}
                  />
                  <button
                    onClick={() => {
                      setSelectedNft(undefined);
                    }}
                    className={tokenPageStyles.crossButton}
                  >
                    X
                  </button>
                </div>
              </div>
  
              <div className={tokenPageStyles.listingContainer}>
          
                <h1 className={tokenPageStyles.title}>
                  {selectedNft.metadata.name}
                </h1>
                <p className={tokenPageStyles.collectionName}>
                  Ranking:  {selectedNft?.metadata.ranking as string}
                </p>
                <h3 className={styles.descriptionTitle}>Traits</h3>
                <SimpleGrid columns={2} spacing={4}>
                    {(selectedNft?.metadata?.attributes as { trait_type: string; value: string }[] || []).map(
                        (attribute, index) => (
                        <Flex
                            key={index}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor="#333333"
                            borderColor="#AAAAAA"  // Set the border color
                            borderStyle="solid"  // Set the border style
                            marginRight="5px"
                            marginLeft="5px"

                            borderWidth="1"
                            p="1px"
                            borderRadius="4px" // Set border radius here
                        >
                            <Text fontSize="large" fontWeight="bold" align="center" margin="1px">
                            {attribute.trait_type}
                            </Text>

                            <Text fontSize="12px" align="center">
                            {attribute.value}
                            </Text>
                        </Flex>
                        )
                    )}
                </SimpleGrid>
               

              </div>
            </div>
          )}
       </div>
      
      </Container>
    );
  }
