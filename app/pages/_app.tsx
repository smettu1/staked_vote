import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const walletAdapter = new PhantomWalletAdapter();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        onError={(error) => console.log("error connecting", error)}
        wallets={[walletAdapter]}
        autoConnect
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
