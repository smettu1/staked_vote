import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeVotingArgs {
  stakeAmount: BN
  voterCount: number
}

export interface InitializeVotingAccounts {
  voter: PublicKey
  tokenProgram: PublicKey
  mintAccount: PublicKey
  rent: PublicKey
  escrowAccount: PublicKey
  admin: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("stakeAmount"),
  borsh.i32("voterCount"),
])

export function initializeVoting(
  args: InitializeVotingArgs,
  accounts: InitializeVotingAccounts
) {
  const keys = [
    { pubkey: accounts.voter, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.mintAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.escrowAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([221, 65, 224, 76, 101, 60, 147, 175])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      stakeAmount: args.stakeAmount,
      voterCount: args.voterCount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
