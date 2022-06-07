/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const Auth = () => {
  const { wallets, select } = useWallet();
  const handleConnect = async () => {
    select(wallets[0].adapter.name);
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <button
        className="mt-3 flex items-center justify-center bg-secondary px-2 py-1 text-white drop-shadow-xl transition duration-150 ease-out hover:bg-secondary-highlight hover:drop-shadow-2xl md:text-xl lg:text-3xl"
        onClick={handleConnect}
      >
        <img
          alt="phantom"
          className="mr-4 h-10 w-10 md:h-14 md:w-14"
          src="/images/phantom.png"
        />
        Connect with phantom
      </button>
    </div>
  );
};

export default Auth;
