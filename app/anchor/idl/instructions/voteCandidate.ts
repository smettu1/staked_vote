import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface VoteCandidateArgs {
  idx: number
}

export interface VoteCandidateAccounts {
  tokenProgram: PublicKey
  voterAta: PublicKey
  escrowAccount: PublicKey
  player: PublicKey
  voter: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.u32("idx")])

export function voteCandidate(
  args: VoteCandidateArgs,
  accounts: VoteCandidateAccounts
) {
  const keys = [
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.voterAta, isSigner: false, isWritable: true },
    { pubkey: accounts.escrowAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.player, isSigner: true, isWritable: true },
    { pubkey: accounts.voter, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([66, 238, 61, 153, 143, 252, 82, 173])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      idx: args.idx,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
