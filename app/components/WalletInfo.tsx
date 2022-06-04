import React from "react";
import { useMoralis } from "react-moralis";

const WalletInfo = () => {
  const { user } = useMoralis();
  return (
    <div>
      WalletInfo <div>{user?.get("solAddress")}</div>
    </div>
  );
};

export default WalletInfo;
