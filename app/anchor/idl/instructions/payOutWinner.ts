import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PayOutWinnerAccounts {
  tokenProgram: PublicKey
  voterAta: PublicKey
  escrowAccount: PublicKey
  voter: PublicKey
  voterac: PublicKey
  systemProgram: PublicKey
}

export function payOutWinner(accounts: PayOutWinnerAccounts) {
  const keys = [
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.voterAta, isSigner: false, isWritable: true },
    { pubkey: accounts.escrowAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.voter, isSigner: true, isWritable: true },
    { pubkey: accounts.voterac, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([246, 189, 209, 86, 115, 196, 31, 8])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
