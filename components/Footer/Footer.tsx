import React from 'react';
import styles from '../../styles/Home.module.css'; // Import your CSS module
import Image from 'next/image'; // Import the Image component from next/image
import {NFT_ADDRESS, twitterLink, telegramLink, discordLink} from '../../const/contractAddresses';


const Footer = () => {
  const contract = NFT_ADDRESS;

  return (
    <>
      <footer className={styles.footer}>
        
        <div className={styles.footer2}>
          
          <a className={styles.iconFooter} href={twitterLink} target="_blank" rel="noopener noreferrer">
            <Image src="/images/header/twitter.webp" alt="Twitter"  width={25} height={25}  />
          </a>
          <a className={styles.iconFooter} href={telegramLink} target="_blank" rel="noopener noreferrer">
            <Image src="/images/header/telegram.webp" alt="Telegram"   width={25} height={25}/>
          </a>
        </div>

      <footer className={styles.footer2}>
        <a href={`https://blockscout.com/etc/mainnet/address/${contract}/contracts#address-tabs`}>
          <p>CONTRACT</p>
        </a>
      </footer>

      <footer className={styles.footer2}>
        <div className={styles.links}>
          <div className={styles.footer1}>
            <p>
              COPYRIGHT © 2024. POWERED BY{' '}
              <a href="https://www.ethereumclassic.org" className={styles.link}>
              ETHEREUMCLASSIC.
              </a>
            </p>
          </div>
        </div>
      </footer>
      </footer>
    </>
  );
};

export default Footer;
