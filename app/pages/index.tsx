/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import { useMoralis, useMoralisSolanaApi } from "react-moralis";
import Auth from "../components/Auth";
import Home from "../components/Home";

const Index: NextPage = () => {
  const { isAuthenticated, authenticate, logout, user } = useMoralis();
  // const {} = useMoralisSolanaApi();

  if (!isAuthenticated) return <Auth />;

  return <Home />;
};

export default Index;
