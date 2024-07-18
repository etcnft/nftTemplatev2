
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import styles from "../../styles/Home.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NFT_ADDRESS, title, description, welcome, maxSupply, mintPrice, maxPerWallet } from "../../const/contractAddresses";
import { useSendTransaction } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc721";
import { useAddress } from "@thirdweb-dev/react";
import { on } from "events";

interface MintContainerProps {
  contract: any; // Adjust the type based on your contract
  isLoading: any;
  error: any;
}

const MintContainer: React.FC<MintContainerProps> = ({ contract , isLoading, error}) => {

  const userAddress = useAddress();
   //Increment Section
   const [quantity, setQuantity] = useState<number>(1); // Specify quantity as a number
   const [totalPrice, setTotalPrice] = useState<number>(1.2); // Specify totalPrice as a number
   const [mintedSuccess, setMintedSuccess] = useState(false);

   
  useEffect(() => {
    // Update total price whenever quantity changes
    setTotalPrice((prevTotalPrice) => parseFloat((quantity * mintPrice).toFixed(1))); // Ensure to convert the string to a number
  }, [quantity]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 5));
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleSetMax = () => {
    setQuantity(5);
  };

  //MINT
  const mint = async () => {
    const mintButton = document.getElementById("mintButton") as HTMLButtonElement | null;

    if (mintButton) {
      mintButton.disabled = true;
      const spinner = '<div class="dot-elastic"></div><span>Waiting for transaction...</span>';
      mintButton.innerHTML = spinner;      
  
    } else {
      console.error("Element with ID 'mintButton' not found");
    }
   
    if (true) {
      // PUBLIC MINT  
      try {
        const receiver = userAddress;
        console.log("Receiver:", receiver);

        const qty = BigInt(quantity);
        console.log("Quantity:", qty, ", ", quantity); // Ensure this is a BigNumberish type

        const currency = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"; // Native ETC address
        console.log("Currency:", currency);

        const pricePerToken = ethers.utils.parseEther(mintPrice.toString());
        console.log("Price Per Token:", pricePerToken);

        const allowlistProof = {
          proof: [], // Replace with the actual proof
          quantityLimitPerWallet: BigInt(maxPerWallet), // Ensure this is a BigNumberish type
          pricePerToken: ethers.utils.parseEther(pricePerToken.toString()),
          currency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" // Native ETC address
        };
        console.log("Allowlist Proof:", allowlistProof);

        const data = "0x"; // Replace with actual data if needed
        console.log("Data:", data);


        const mintTransaction = await contract?.call("claim", [
          receiver,
          qty,
          currency,
          pricePerToken,
          allowlistProof,
          data
        ], {
          value: ethers.utils.parseEther(totalPrice.toString()), 
        });

        console.log("Sent Mint: ", mintTransaction)


        if(mintTransaction) {
          console.log("MINT SUCCESS")
          if(mintButton){
            mintButton.disabled = false;
            mintButton.innerHTML = "MINT";
            }
          toast.success('🐸 MINT SUCCESSFUL!! \n Check Wallet for Mints.', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          const url = '' //`https://blockscout.com/etc/mainnet/tx/${mintTransaction.receipt.transactionHash}`;
          setMintedSuccess(true);
          
          const mintedContainer = document.querySelector('minted-container');
          const countdownContainer = document.querySelector('countdown');
          const mintedTxnBtn = document.getElementById("mintedTxnBtn") as HTMLAnchorElement | null;
          if(mintedTxnBtn){
            mintedTxnBtn.href = url;
          }
          if (countdownContainer) {
            countdownContainer.classList.add('hidden');
          }
          if(mintedContainer){
            mintedContainer.classList.remove('hidden');
          }
        
          //console.log("Minted successfully!", `Transaction Hash: ${mintTransaction.receipt.transactionHash}`);
        } else {
          const mainText = document.getElementById("mainText");
          if (mainText){
            mainText.innerText = "Mint Failed";
          }
          if(mintButton){
            mintButton.innerText = "Mint";
            mintButton.disabled = false;
          }
          
          console.log("Failed to mint!");
        }
      } catch (error: unknown) {
        console.error("Error minting:", error);
  
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
  
        toast.error(`❌ MINT FAILED!! \n ${errorMessage}`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        const mainText = document.getElementById("mainText");
        if (mainText){
          mainText.innerText = "Mint Failed";
        }
        if(mintButton){
          mintButton.innerText = "Mint";
          mintButton.disabled = false;
        }
      }
    }
  };

    //Token Supply Section
    const [tokenSupply, setTokenSupply] = useState<string | null>(null);
    const [progressPercentage, setProgressPercentage] = useState<number>(0);
    const fetchTokenSupply = async () => {
      try {
        
        // Specify the expected type of totalSupply (in this case, a string)
        const totalSupply: string = await contract?.call("totalSupply");
    
        // Convert the result to a string using JavaScript's toString method
        const formattedSupply = totalSupply.toString();
    
        setTokenSupply(formattedSupply);
  
        // Calculate the progress percentage
        const mintedTokens = parseInt(totalSupply, 10);
        const totalTokens = maxSupply;
        const percentage = (mintedTokens / totalTokens) * 100;
        setProgressPercentage(percentage);
  
        
        // Log the minted supply inside the try block
        console.log("Minted: ", formattedSupply);
      } catch (error) {
        console.error('Error fetching token supply:', error);
        setTokenSupply('586'); // Return a string to handle large numbers
      }
    };
   
    if(isLoading){
      console.log("LOADING")
    } else if (contract) {
      fetchTokenSupply();
    } else if (error){
      console.log("ERROR LOADING CONTRACT")
    }

  return (

    <><ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" /><div id="mintContainer" className="mintcontainer">
        <h2 id="mint">
          {welcome}
        </h2>
        <div className={styles.infocontainer}>
          <div>
            <h3>Minted/Supply</h3>
            <div className={styles.infocontainer}><p id="minted">{tokenSupply}</p><p>/</p><p id="totalSupply">{maxSupply}</p></div>
            <div className={styles.progressbar}>
              <div className={styles.progress} style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          <div>
            <h3>Price Per Mint</h3>
            <p id="pricePerMint">{mintPrice} ETC</p>
          </div>
          <div>
            <h3>Max</h3>
            <p id="maxPerMint">20</p>
          </div>
        </div>
        <div className={styles.mintqty}>
          <span>
            <button className={`${styles.inputnumberdecrement} ${styles.btn}`} onClick={handleDecrement}>-</button>
            <input
              className={`${styles.inputnumber} ${styles.btn}`}
              type="number"
              value={quantity}
              min="1"
              max="20"
              readOnly />
            <button className={`${styles.inputnumberincrement} ${styles.btn}`} onClick={handleIncrement}>+</button>
          </span>
          <button id="setQtyMax" className={styles.btn} onClick={handleSetMax}>SET MAX</button>
        </div>
        <div className={styles.totalpricecontainer}>
          <h3>Total</h3>
          <p id="totalPrice">{`${totalPrice.toFixed(1)} ETC`}</p>
        </div>

        <button
          id="mintButton"
          className={`${styles.herobtn} ${styles.btn} ${styles.mintbtn}`}
          onClick={mint}
        >
          Mint
        </button>
      </div></>

  );

};

export default MintContainer;
