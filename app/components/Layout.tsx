import Head from "next/head";
import React from "react";

const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="flex h-screen w-screen flex-row bg-primary text-highlight">
      <Head>
        <title>Voting Dapp</title>
        <meta name="description" content="Simple solana voting dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>

      <footer></footer>
    </div>
  );
};

export default Layout;
