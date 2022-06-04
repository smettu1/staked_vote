import React from "react";
import { useMoralis } from "react-moralis";

const WalletInfo = () => {
  const { user } = useMoralis();
  return (
    <div>
      <div className="mb-5 md:text-3xl">Wallet Information</div>
      <div>
        <span className="md:text-xl"> Address</span> <br />
        {user?.get("solAddress")}
      </div>
    </div>
  );
};

export default WalletInfo;
