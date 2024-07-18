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

const NFTcontract = "0x5b2e0227d4Fd0F5b091663A8abD275952586d311"

export default function MintedPage() {

  const { contract, isLoading } = useContract(NFTcontract);
  
  const sdk = new ThirdwebSDK(NETWORK, {
    secretKey: process.env.TW_SECRET_KEY,
  });
  
  const [selectedNft, setSelectedNft] = useState<NFTType>();

  const [loadingNFTArray, setLoadingNFTArray] = useState(true)

// Token Supply Section
const [tokenSupply, setTokenSupply] = useState<string | null>(null);
const [mintedNFTs, setMintedNFTs] = useState<NFTType[]>([]);

useEffect(() => {
  const fetchTokenSupply = async () => {
    try {
      if (contract) {
        console.log("Getting Supply");
        // Fetch total token supply
        const totalSupply: string = await contract?.call("totalSupply");
        const formattedSupply = totalSupply.toString();
        setTokenSupply(formattedSupply);
        console.log("Total Supply: ", formattedSupply);

        // Calculate the progress percentage
        const mintedTokens = parseInt(totalSupply, 10);

        // Fetch minted NFTs
        const mintedNFTsArray: NFTType[] = [];
        const owners = await contract.erc721.getAllOwners();
        console.log("Owners: ",owners);  
        for (const owner of owners) {
          const nfts = await contract.erc721.getOwned(owner.owner);
          // Check for duplicates before adding to the array
          nfts.forEach((nft) => {
            if (!mintedNFTsArray.some((existingNFT) => existingNFT.metadata.id === nft.metadata.id)) {
              mintedNFTsArray.push(nft);
            }
          });
        }

        setMintedNFTs(mintedNFTsArray);

        // Log the minted supply and NFTs inside the try block
        console.log("Minted: ", formattedSupply);
        console.log("Minted NFTs: ", mintedNFTsArray);
      }
    } catch (error) {
      console.error('Error fetching token supply:', error);
      setTokenSupply('7777'); // Return a string to handle large numbers
    }
  };

  fetchTokenSupply();
}, [contract]); // Run on component mount and whenever 'contract' changes


    return (
      <Container maxWidth="lg">

        <div
          className={styles.activeTabContent}
        >
          <div className={styles.data}>
            <h3>
                Minted DAWGS
            </h3>
            <h3>
                Total Minted = {tokenSupply}
            </h3>
            
          </div>
          <div>
            {!selectedNft ? (
                <>
                  
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
