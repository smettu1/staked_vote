import React from "react";
import {
  Connection,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { voteCandidate } from "../../anchor/idl/instructions";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useMoralis } from "react-moralis";
import { PROGRAM_ID } from "../../anchor/idl/programId";
import Button from "../buttons/Button";
import { useWallet } from "@solana/wallet-adapter-react";

const ESCROW_ACCOUNT_PDA_SEED = "escrow_12";

const Voting = () => {
  const { user } = useMoralis();
  const { sendTransaction, publicKey } = useWallet();

  // useSolana;
  const handleVote = async () => {
    try {
      const userPK = new PublicKey(user?.get("solAddress"));
      const playerPK = new PublicKey(userPK); // hardcoded for now
      const [escrow_pda, escrow_bump] = await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_ACCOUNT_PDA_SEED, "utf8")],
        PROGRAM_ID
      );
      const connection = new Connection(clusterApiUrl("devnet"));
      const tx = new Transaction();
      const voterATA = await getAssociatedTokenAddress(
        new PublicKey("2wNfZTMkUndd5rSbWy1H7Ri17XgHWzLcULAnbuJsSQH7"), // got it from deploy
        playerPK
      );
      const voteInstruction = voteCandidate(
        { idx: 1 },
        {
          tokenProgram: TOKEN_PROGRAM_ID,
          escrowAccount: escrow_pda,
          player: playerPK,
          voter: userPK,
          voterAta: voterATA,
          systemProgram: SystemProgram.programId,
        }
      );
      tx.add(voteInstruction);
      // window.solana.signTransaction(tx);
      // const result = await sendAndConfirmTransaction(connection, tx, []);
      console.log("sending tx");
      const result = await sendTransaction(tx, connection);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="text-center md:text-3xl">Active Voting</div>
      <Button onClick={handleVote}>Vote for candidate 1</Button>
    </div>
  );
};

export default Voting;
