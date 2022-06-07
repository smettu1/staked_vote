/* eslint-disable @next/next/no-img-element */
import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Auth from "../components/Auth";
import Home from "../components/Home";

const Index: NextPage = () => {
  const { connected } = useWallet();

  if (!connected) return <Auth />;

  return <Home />;
};

export default Index;
