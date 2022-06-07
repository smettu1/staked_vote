import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletInfo = () => {
  const { publicKey } = useWallet();
  return (
    <div>
      <div className="mb-5 md:text-3xl">Wallet Information</div>
      <div>
        <span className="md:text-xl"> Address</span> <br />
        {publicKey?.toString()}
      </div>
    </div>
  );
};

export default WalletInfo;
