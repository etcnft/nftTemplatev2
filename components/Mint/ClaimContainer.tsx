
import { useState } from "react";
import {
  useTokenBalance,
  useContract,
  useAddress,
  useContractWrite,
} from "@thirdweb-dev/react";
import { NFT_ADDRESS } from "../../const/contractAddresses";
import styles from "../../styles/Home.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ClaimContainerProps {
  contract: any; // Adjust the type based on your contract
  isLoading: any;
  error: any;
}

const MintContainer: React.FC<ClaimContainerProps> = ({ contract , isLoading, error}) => {

  const currentUserAddress = useAddress();
  const { contract: TokenContract, isLoading: loadingToken, error: TokenError }  = useContract("0x731e2E78c318f6763DbBc9EFA4675a8061C11164")
  const { mutateAsync: approve, isLoading: loadingApprove } = useContractWrite(TokenContract, "approve")

   //Increment Section
  const [totalPrice, setTotalPrice] = useState<number>(0.4); // Specify totalPrice as a number
  const [mintedSuccess, setMintedSuccess] = useState(false);
  const { data: TokenBalance, isLoading: loadingBalance, error: BalanceError } = useTokenBalance(
  TokenContract,
  currentUserAddress,
  );

  
  //claim
  const claim = async () => {
    const claimButton = document.getElementById("claimButton") as HTMLButtonElement | null;

    if (claimButton) {
      claimButton.disabled = true;
      const spinner = '<div class="dot-elastic"></div><span>Waiting for transaction...</span>';
      claimButton.innerHTML = spinner;      
  
    } else {
      console.error("Element with ID 'claimButton' not found");
    }
   
    if (true) { 
      // PUBLIC MINT  
      try {
        console.log("Try Claim")
        const allowance = await TokenContract?.call("allowance",[currentUserAddress,NFT_ADDRESS]);
        const value = BigInt(1000000000000000000);
        
        console.log("Allowance: ", allowance)
        if (allowance < 1){ 
          // Call the `approve` function of the Token Contract
          const data = await approve({ args: [NFT_ADDRESS, value] });
          const call = async () => {
            try {
              const data = await approve({ args: [NFT_ADDRESS, 1] });
              console.info("contract call successs", data);
            } catch (err) {
              console.error("contract call failure", err);
            }
          } 
     
        } else {
          console.log("Tokens are already approved.");
        }
        const claimTransaction = await contract?.call("claimNFT");
        console.log(claimTransaction)

        if(claimTransaction) {

          console.log("Claim Success")
          if(claimButton){
          claimButton.disabled = false;
          claimButton.innerHTML = "Claim";
          }
          
          toast.success('🐸 CLAIM SUCCESSFUL!! \n Check Wallet for Mints.', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          const url = `https://blockscout.com/etc/mainnet/tx/${claimTransaction.receipt.transactionHash}`;
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
          console.log("Claimed successfully!", `Transaction Hash: ${claimTransaction.receipt.transactionHash}`);
        } else {
          const mainText = document.getElementById("mainText");
          if (mainText){
            mainText.innerText = "Claim Failed";
          }
          if(claimButton){
            claimButton.innerText = "Claim";
            claimButton.disabled = false;
          }
          console.log("Failed to claim!");
          toast.error(`❌ CLAIM FAILED!!`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch(e) {
        const mainText = document.getElementById("mainText");
        if (mainText){
          mainText.innerText = "Claim Failed";
        }
        if(claimButton){
          claimButton.innerText = "Claim";
          claimButton.disabled = false;
        }
        console.log(e);
        toast.error(`❌ CLAIM FAILED!!`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
  



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
    theme="light"
    />
    <div id="claimContainer" className="mintcontainer">
      <h2 id="claimHeading">Claim Your Froggie NFT</h2>
      <p>
        Welcome to FROGGIES.
        <br />You will be asked to approve the transfer of Froggie Claim Tokens(FCT)
      </p>
      <button
        id="claimButton"
        className={`${styles.herobtn} ${styles.btn} ${styles.mintbtn}`}
        onClick={claim}
      >
        Claim
      </button>
    </div></>

        );

};

export default MintContainer;

