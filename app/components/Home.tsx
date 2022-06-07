import React from "react";
import Voting from "./Voting/Voting";
import WalletInfo from "./WalletInfo";

const Home = () => {
  return (
    <div className="flex h-full w-full flex-row justify-between">
      <WalletInfo />
      <Voting />
    </div>
  );
};

export default Home;
