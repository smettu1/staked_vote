import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface VoteFields {
  authority: PublicKey
  winner: number
  winnerCount: number
  totalParticipants: number
  stakeAmount: BN
  votingChoice: Array<number>
}

export interface VoteJSON {
  authority: string
  winner: number
  winnerCount: number
  totalParticipants: number
  stakeAmount: string
  votingChoice: Array<number>
}

export class Vote {
  readonly authority: PublicKey
  readonly winner: number
  readonly winnerCount: number
  readonly totalParticipants: number
  readonly stakeAmount: BN
  readonly votingChoice: Array<number>

  static readonly discriminator = Buffer.from([
    96, 91, 104, 57, 145, 35, 172, 155,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.u32("winner"),
    borsh.u32("winnerCount"),
    borsh.i32("totalParticipants"),
    borsh.u64("stakeAmount"),
    borsh.vec(borsh.u32(), "votingChoice"),
  ])

  constructor(fields: VoteFields) {
    this.authority = fields.authority
    this.winner = fields.winner
    this.winnerCount = fields.winnerCount
    this.totalParticipants = fields.totalParticipants
    this.stakeAmount = fields.stakeAmount
    this.votingChoice = fields.votingChoice
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Vote | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<Vote | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): Vote {
    if (!data.slice(0, 8).equals(Vote.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Vote.layout.decode(data.slice(8))

    return new Vote({
      authority: dec.authority,
      winner: dec.winner,
      winnerCount: dec.winnerCount,
      totalParticipants: dec.totalParticipants,
      stakeAmount: dec.stakeAmount,
      votingChoice: dec.votingChoice,
    })
  }

  toJSON(): VoteJSON {
    return {
      authority: this.authority.toString(),
      winner: this.winner,
      winnerCount: this.winnerCount,
      totalParticipants: this.totalParticipants,
      stakeAmount: this.stakeAmount.toString(),
      votingChoice: this.votingChoice,
    }
  }

  static fromJSON(obj: VoteJSON): Vote {
    return new Vote({
      authority: new PublicKey(obj.authority),
      winner: obj.winner,
      winnerCount: obj.winnerCount,
      totalParticipants: obj.totalParticipants,
      stakeAmount: new BN(obj.stakeAmount),
      votingChoice: obj.votingChoice,
    })
  }
}
