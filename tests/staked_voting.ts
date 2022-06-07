import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { StakedVoting } from "../target/types/staked_voting";
import { expect } from "chai";

import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  Account,
  getMint,
  getAccount,
  AccountLayout,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
const { SystemProgram } = anchor.web3;
//window.Buffer = window.Buffer || require("buffer").Buffer;
let mint: PublicKey;

const ESCROW_ACCOUNT_PDA_SEED = "escrow_12";

describe("StakedVoting", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(anchor.AnchorProvider.local());
  const LAMPORTS_PER_SOL = 1000000000;
  let voter1TokenAccount1 = null;
  let voter2TokenAccount1 = null;
  let voter3TokenAccount1 = null;
  let voter4TokenAccount1 = null;
  let voter5TokenAccount1 = null;

  const program = anchor.workspace.StakedVoting as Program<StakedVoting>;
  // Account address generated here
  const voter = anchor.web3.Keypair.generate();
  const voter_admin = anchor.web3.Keypair.generate();
  const voter1 = anchor.web3.Keypair.generate();
  const voter2 = anchor.web3.Keypair.generate();
  const voter3 = anchor.web3.Keypair.generate();
  const voter4 = anchor.web3.Keypair.generate();
  const voter5 = anchor.web3.Keypair.generate();

  before(async () => {
    // Top up all accounts that will need lamports for account creation
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        voter.publicKey,
        2 * LAMPORTS_PER_SOL
      )
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        voter_admin.publicKey,
        2 * LAMPORTS_PER_SOL
      )
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        voter1.publicKey,
        20 * LAMPORTS_PER_SOL
      )
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        voter2.publicKey,
        20 * LAMPORTS_PER_SOL
      )
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        voter3.publicKey,
        20 * LAMPORTS_PER_SOL
      )
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        voter4.publicKey,
        20 * LAMPORTS_PER_SOL
      )
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        voter5.publicKey,
        20 * LAMPORTS_PER_SOL
      )
    );

    // Mint tokens
    let fromTokenAccount: Account;
    mint = await createMint(
      provider.connection,
      voter,
      voter.publicKey,
      null,
      1 // 1 here means we have a decimal of 1 0's
    );
    console.log(`Create token: ${mint.toBase58()}`);
    // Create token account
    // Get the token account of the fromWallet address, and if it does not exist, create it
    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      voter,
      mint,
      voter.publicKey
    );
    console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
    const signature = await mintTo(
      provider.connection,
      voter,
      mint,
      fromTokenAccount.address,
      voter.publicKey,
      100 // 100 tokens
    );
    console.log(`Mint signature: ${signature}`);
    // Check how much is minted
    const mintInfo = await getMint(provider.connection, mint);
    console.log("Total supply: %d ", mintInfo.supply);

    // get the amount of tokens left in the account
    const tokenAccountInfo = await getAccount(
      provider.connection,
      fromTokenAccount.address
    );
    console.log(tokenAccountInfo.amount);

    //Send to voter1 ATA
    voter1TokenAccount1 = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      voter1,
      mint,
      voter1.publicKey
    );
    // Transfer minted tokens to each accounts
    const signature1 = await transfer(
      provider.connection,
      voter,
      fromTokenAccount.address,
      voter1TokenAccount1.address,
      voter.publicKey,
      10 // 1 token
    );
    //Send to voter2 ATA
    voter2TokenAccount1 = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      voter2,
      mint,
      voter2.publicKey
    );
    // Transfer minted tokens to each accounts
    const signature2 = await transfer(
      provider.connection,
      voter,
      fromTokenAccount.address,
      voter2TokenAccount1.address,
      voter.publicKey,
      10 // 1 token
    );
    //Send to voter3 ATA
    voter3TokenAccount1 = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      voter3,
      mint,
      voter3.publicKey
    );
    // Transfer minted tokens to each accounts
    const signature3 = await transfer(
      provider.connection,
      voter,
      fromTokenAccount.address,
      voter3TokenAccount1.address,
      voter.publicKey,
      10 // 1 token
    );
    //Send to voter4 ATA
    voter4TokenAccount1 = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      voter4,
      mint,
      voter4.publicKey
    );
    // Transfer minted tokens to each accounts
    const signature4 = await transfer(
      provider.connection,
      voter,
      fromTokenAccount.address,
      voter4TokenAccount1.address,
      voter.publicKey,
      10 // 1 token
    );
    //Send to voter4 ATA
    voter5TokenAccount1 = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      voter5,
      mint,
      voter5.publicKey
    );
    // Transfer minted tokens to each accounts
    const signature5 = await transfer(
      provider.connection,
      voter,
      fromTokenAccount.address,
      voter5TokenAccount1.address,
      voter.publicKey,
      10 // 1 token
    );

    console.log(`finished transfer with ${signature}`);
    const tokenAccountInfo1 = await getAccount(
      provider.connection,
      voter1TokenAccount1.address
    );
    const tokenAccountInfo2 = await getAccount(
      provider.connection,
      voter2TokenAccount1.address
    );
    const tokenAccountInfo3 = await getAccount(
      provider.connection,
      voter3TokenAccount1.address
    );
    const tokenAccountInfo4 = await getAccount(
      provider.connection,
      voter4TokenAccount1.address
    );
    const tokenAccountInfo5 = await getAccount(
      provider.connection,
      voter5TokenAccount1.address
    );
    console.log("Total tokens on voter1: %d", tokenAccountInfo1.amount);
    console.log("Total tokens on voter2: %d", tokenAccountInfo2.amount);
    console.log("Total tokens on voter3: %d", tokenAccountInfo3.amount);
    console.log("Total tokens on voter4: %d", tokenAccountInfo4.amount);
    console.log("Total tokens on voter5: %d", tokenAccountInfo5.amount);
    // PDA to stake the tokens
    // create pda-ata, while voting we will transfer token and send choice
  });

  // Init accounts
  it("Creates a voter account", async () => {
    const [escrow_pda, escrow_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(ESCROW_ACCOUNT_PDA_SEED)],
      program.programId
    );

    await program.methods
      .initializeVoting(new anchor.BN(10), 5)
      .accounts({
        voter: voter.publicKey,
        admin: voter_admin.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        mintAccount: mint,
        rent: SYSVAR_RENT_PUBKEY,
        escrowAccount: escrow_pda,
      })
      .signers([voter, voter_admin])
      .rpc();
  });

  //Submit vote for each of voters
  it("Submits a vote for player", async () => {
    // Get starting balances for player1 and lottery account
    let startBalancePlayer: number = await provider.connection.getBalance(
      voter1.publicKey
    );
    let startBalanceVoting: number = await provider.connection.getBalance(
      voter.publicKey
    );
    console.log(voter1.publicKey, voter.publicKey, SystemProgram.programId);

    const [submission, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [voter1.publicKey.toBytes()],
      program.programId
    );
    const [escrow_pda, escrow_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(ESCROW_ACCOUNT_PDA_SEED, "utf8")],
      program.programId
    );

    // Voter1 votes
    await program.methods
      .voteCandidate(new anchor.BN(1))
      .accounts({
        voter: voter.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        voterAta: voter1TokenAccount1.address,
        escrowAccount: escrow_pda,
        player: voter1.publicKey,
      })
      .signers([voter1])
      .rpc();
    // Voter2 votes
    await program.methods
      .voteCandidate(new anchor.BN(2))
      .accounts({
        voter: voter.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        voterAta: voter2TokenAccount1.address,
        escrowAccount: escrow_pda,
        player: voter2.publicKey,
      })
      .signers([voter2])
      .rpc();
    // Voter3 votes
    await program.methods
      .voteCandidate(new anchor.BN(1))
      .accounts({
        voter: voter.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        voterAta: voter3TokenAccount1.address,
        escrowAccount: escrow_pda,
        player: voter3.publicKey,
      })
      .signers([voter3])
      .rpc();
    // Voter4 votes
    await program.methods
      .voteCandidate(new anchor.BN(2))
      .accounts({
        voter: voter.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        voterAta: voter4TokenAccount1.address,
        escrowAccount: escrow_pda,
        player: voter4.publicKey,
      })
      .signers([voter4])
      .rpc();
    // Voter5 votes
    await program.methods
      .voteCandidate(new anchor.BN(1))
      .accounts({
        voter: voter.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        voterAta: voter5TokenAccount1.address,
        escrowAccount: escrow_pda,
        player: voter5.publicKey,
      })
      .signers([voter5])
      .rpc();
  });

  // Pick a winner from the votes
  it("Pick a winner", async () => {
    const [escrow_pda, escrow_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(ESCROW_ACCOUNT_PDA_SEED, "utf8")],
      program.programId
    );

    await program.methods
      .pickWinner()
      .accounts({
        voter: voter.publicKey,
        admin: voter_admin.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([voter_admin])
      .rpc();
    let winner = await program.account.vote.fetch(voter.publicKey);
    console.log(winner);

    // Pay to voter1
    await program.methods
      .payOutWinner()
      .accounts({
        voter: voter.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        voterAta: voter1TokenAccount1.address,
        escrowAccount: escrow_pda,
        voterac: voter.publicKey,
      })
      .signers([voter])
      .rpc();

    console.log(`Winner is declared transfer`);
    const tokenAccountInfo1 = await getAccount(
      provider.connection,
      voter1TokenAccount1.address
    );
    const tokenAccountInfo2 = await getAccount(
      provider.connection,
      voter2TokenAccount1.address
    );
    const tokenAccountInfo3 = await getAccount(
      provider.connection,
      voter3TokenAccount1.address
    );
    const tokenAccountInfo4 = await getAccount(
      provider.connection,
      voter4TokenAccount1.address
    );
    const tokenAccountInfo5 = await getAccount(
      provider.connection,
      voter5TokenAccount1.address
    );

    console.log("Total tokens on voter1: %d", tokenAccountInfo1.amount);
    console.log("Total tokens on voter2: %d", tokenAccountInfo2.amount);
    console.log("Total tokens on voter3: %d", tokenAccountInfo3.amount);
    console.log("Total tokens on voter4: %d", tokenAccountInfo4.amount);
    console.log("Total tokens on voter5: %d", tokenAccountInfo5.amount);
  });
});
