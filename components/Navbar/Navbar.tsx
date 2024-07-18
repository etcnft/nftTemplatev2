import { ConnectWallet, useAddress, darkTheme } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const address = useAddress();
  // to change burger classes
  const [burger_class, setBurgerClass] = useState(`${styles.burger_bar} ${styles.unclicked}`);
  const [menu_class, setMenuClass] = useState(`${styles.menu} ${styles.hidden}`);
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  // toggle burger menu change
  const updateMenu = () => {
    if(!isMenuClicked) {
        setBurgerClass(`${styles.burger_bar} ${styles.clicked}`);
        setMenuClass(`${styles.menu} ${styles.visible}`);
    }
    else {
        setBurgerClass(`${styles.burger_bar} ${styles.unclicked}`);
        setMenuClass(`${styles.menu} ${styles.hidden}`);
    }
    setIsMenuClicked(!isMenuClicked);
}
  
  return (

    <div className={styles.navContainer}>      
      
      <nav className={styles.nav}>
      <div className={styles.burger_menu} onClick={updateMenu}>
            <div className={burger_class} ></div>
            <div className={burger_class} ></div>
            <div className={burger_class} ></div>
          </div>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image
              src="/images/x-icon/icon.png"
              width={48}
              height={48}
              alt=""
            />
          </Link>
        </div>
        <div className={styles.navMiddle}>
            <Link  href="/" className={styles.linkheader}>
            MINT
            </Link>
            <Link  href={`/profile/${address}`} className={styles.linkheader}>
            WALLET
            </Link>
            <Link  href={`/rewards`} className={styles.linkheader}>
            REWARDS
            </Link>
            <Link  href={`https://raritysniper.com/the-classic-dawgs`} className={styles.linkheader} target="_blank">
            RARITY SNIPER
            </Link>


            

           
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
          <ConnectWallet
        theme={darkTheme({
          colors: {
            modalBg: "#0d120f",
            dropdownBg: "#0d120f",
            connectedButtonBg: "#21312a",
            secondaryText: "#5b8e39",
          },
        })}
        btnTitle={"Connect"}
        modalTitle={"Connect Wallet"}
        switchToActiveChain={true}
        modalSize={"compact"}
        welcomeScreen={{
          title: "Welcome to Froggies.",
          subtitle:
            "Connect your wallet to get started.",
        }}
      />
        </div>
        
          
        </div>
      </nav>
      <div className={menu_class}>
       
        <Link  href="/" className={styles.linkheader} onClick={updateMenu} style={{ marginTop: '10px' }}>
        MINT
        </Link>
        <Link  href={`/profile/${address}`} className={styles.linkheader} onClick={updateMenu}>
        WALLET
        </Link>
        <Link  href={`/rewards`} className={styles.linkheader} onClick={updateMenu}>
        REWARDS
        </Link>
        <Link  href={`https://raritysniper.com/the-classic-dawgs`} className={styles.linkheader} onClick={updateMenu} target="_blank">
            RARITY SNIPER
        </Link>

       
      </div>
    </div>
  );
}

