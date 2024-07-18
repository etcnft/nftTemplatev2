import type { AppProps } from "next/app";
import { Navbar } from "../components/Navbar/Navbar";
import NextNProgress from "nextjs-progressbar";
import { NETWORK } from "../const/contractAddresses";
import "../styles/globals.css";
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  darkTheme,
  en,
} from "@thirdweb-dev/react";
import Footer from "../components/Footer/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      supportedChains={[NETWORK]}
      clientId={"a330a7cda7e0e88154090ddfffc658f7"}
      activeChain={NETWORK}
      locale={en()}
      supportedWallets={[
      metamaskWallet({ recommended: true }),
    ]}
    >
      {/* Progress bar when navigating between pages */}
      <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      {/* Render the navigation menu above each component */}
      <Navbar />
      
      {/* Render the actual component (page) */}
      <Component {...pageProps} />
      <Footer />

    </ThirdwebProvider>
  );
}

export default MyApp;
