/* global Moralis */
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import Layout from "../components/Layout";

// declare var Moralis: any;

function MyApp({ Component, pageProps }: AppProps) {
  // Moralis.settings.setAPIRateLimit({
  //   anonymous: 10,
  //   authenticated: 20,
  //   windowMs: 60000,
  // });

  // DEFAULT VALUES MIGHT NOT WORK IN THE FUTURE, IN THAT CASE
  // CREATE A NEW .env FILE FROM .env.template AND
  // ADD THE VALUES FROM A NEW MORALIS TEST SERVER (https://admin.moralis.io/servers)
  const moralisServerUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL ?? "";
  const moralisAppId = process.env.NEXT_PUBLIC_MORALIS_APP_ID ?? "";

  return (
    <MoralisProvider serverUrl={moralisServerUrl} appId={moralisAppId}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MoralisProvider>
  );
}

export default MyApp;
