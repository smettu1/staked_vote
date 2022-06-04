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

      <main className="mx-8 my-5 flex h-full w-full flex-col items-center">
        <div className="mb-3 md:text-5xl">Simple Solana Voting Dapp</div>
        {children}
      </main>

      <footer></footer>
    </div>
  );
};

export default Layout;
