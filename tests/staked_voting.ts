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
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo, 
  transfer, 
  Account, 
  getMint, 
  getAccount,
  AccountLayout,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
const { SystemProgram } = anchor.web3;
//window.Buffer = window.Buffer || require("buffer").Buffer;
let mint: PublicKey;

const ESCROW_ACCOUNT_PDA_SEED =  "escrow_12";

describe("StakedVoting", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(anchor.AnchorProvider.local());
  const LAMPORTS_PER_SOL = 1000000000;
  let voter1TokenAccount1 = null;

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
		console.log("Total supply: %d ",mintInfo.supply);
		
		// get the amount of tokens left in the account
    const tokenAccountInfo = await getAccount(provider.connection, fromTokenAccount.address);
    console.log(tokenAccountInfo.amount);

    voter1TokenAccount1 = await getOrCreateAssociatedTokenAccount(
      provider.connection, 
      voter1, 
      mint, 
      voter1.publicKey);
    // Transfer minted tokens to each accounts
    const signature1 = await transfer(
      provider.connection,
      voter,
      fromTokenAccount.address,
      voter1TokenAccount1.address,
      voter.publicKey,
      10 // 1 token
    );
    console.log(`finished transfer with ${signature}`);
    const tokenAccountInfo1 = await getAccount(provider.connection, voter1TokenAccount1.address);
    console.log("Total tokens on voter1: %d",tokenAccountInfo1.amount);

    // PDA to stake the tokens
    // create pda-ata, while voting we will transfer token and send choice
  });

  it("Creates a voter account", async () => {
    const [escrow_pda, escrow_bump] =
      await PublicKey.findProgramAddress(
        [Buffer.from(ESCROW_ACCOUNT_PDA_SEED)],
        program.programId
      );

    await program.methods
      .initializeVoting(new anchor.BN(LAMPORTS_PER_SOL),5)
      .accounts({
        voter: voter.publicKey,
        admin: voter_admin.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        mintAccount: mint,
        rent: SYSVAR_RENT_PUBKEY,
        escrowAccount: escrow_pda
      })
      .signers([voter, voter_admin])
      .rpc();
  });

  it("Submits a vote for player", async () => {
    // Get starting balances for player1 and lottery account
    let startBalancePlayer: number = await provider.connection.getBalance(
      voter1.publicKey
    );
    let startBalanceVoting: number = await provider.connection.getBalance(
      voter.publicKey
    );
    console.log(voter1.publicKey,voter.publicKey,SystemProgram.programId)

    const [submission, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [voter1.publicKey.toBytes()],
      program.programId
    );
    const [escrow_pda, escrow_bump] = await PublicKey.findProgramAddress(
      [Buffer.from(ESCROW_ACCOUNT_PDA_SEED, 'utf8')],
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
  });

    // Pick a winner
    it("Pick a winner", async () => {
      await program.methods
        .pickWinner()
        .accounts({
          voter: voter.publicKey,
          admin: voter_admin.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([voter_admin])
        .rpc();
        let winner = await program.account.vote.fetch(voter.publicKey)
        console.log(winner)
      });

      // winner and transfer   

    // UI
        //  Create tokens, Airdrop to white listed accounts
        //   
    // Typescript 
    


    // // const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    // //   provider.connection, voter1, mint, escrow_pda);
    // // console.log(`PDA token account toTokenAccount ${toTokenAccount.address}`);

    // // const signature = await transfer(
    // //       provider.connection,
    // //       voter1,
    // //       voter1TokenAccount1.address,
    // //       toTokenAccount.address,
    // //       voter1.publicKey,
    // //       1 // 1 token
    // //   );

    // // TODO we need to caliculate the winner after last person votes
    
    // // TODO Transfer the tokens to winner.

    // // choose a vote option
    // await program.methods
    //   .voteCandidate(new anchor.BN(1))
    //   .accounts({
    //     voter: voter.publicKey,
    //     player: voter1.publicKey,
    //     choice: submission,
    //     systemProgram: SystemProgram.programId,
    //   })
    //   .signers([voter1])
    //   .rpc();

  //   // Voting for voter2
  //   const [submission1, bump1] = await anchor.web3.PublicKey.findProgramAddress(
  //     [voter2.publicKey.toBytes()],
  //     program.programId
  //   );
  //   await program.methods
  //   .voteCandidate(new anchor.BN(2))
  //   .accounts({
  //     voter: voter.publicKey,
  //     player: voter2.publicKey,
  //     choice: submission1,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .signers([voter2])
  //   .rpc();

  //   // Voting for voter3
  //   const [submission2, bump2] = await anchor.web3.PublicKey.findProgramAddress(
  //     [voter3.publicKey.toBytes()],
  //     program.programId
  //   );
  //   await program.methods
  //   .voteCandidate(new anchor.BN(1))
  //   .accounts({
  //     voter: voter.publicKey,
  //     player: voter3.publicKey,
  //     choice: submission2,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .signers([voter3])
  //   .rpc();

  //   // Voting for voter4
  //   const [submission3, bump3] = await anchor.web3.PublicKey.findProgramAddress(
  //     [voter4.publicKey.toBytes()],
  //     program.programId
  //   );
  //   await program.methods
  //   .voteCandidate(new anchor.BN(1))
  //   .accounts({
  //     voter: voter.publicKey,
  //     player: voter4.publicKey,
  //     choice: submission3,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .signers([voter4])
  //   .rpc();
      
  //   // Voting for voter5
  //   const [submission4, bump4] = await anchor.web3.PublicKey.findProgramAddress(
  //     [voter5.publicKey.toBytes()],
  //     program.programId
  //   );
  //   await program.methods
  //   .voteCandidate(new anchor.BN(1))
  //   .accounts({
  //     voter: voter.publicKey,
  //     player: voter5.publicKey,
  //     choice: submission4,
  //     systemProgram: SystemProgram.programId,
  //   })
  //   .signers([voter5])
  //   .rpc();
        
  //   let VotingState1 = await program.account.vote.fetch(voter.publicKey)
  //   console.log(VotingState1)
  // });

  // it("Pick a winner", async () => {
  //   await program.methods
  //     .pickWinner()
  //     .accounts({
  //       voter: voter.publicKey,
  //       admin: voter_admin.publicKey,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .signers([voter_admin])
  //     .rpc();
  //     let winner = await program.account.vote.fetch(voter.publicKey)
  //     console.log(winner)

});
