import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ChoiceFields {
  submitter: PublicKey
  idx: number
}

export interface ChoiceJSON {
  submitter: string
  idx: number
}

export class Choice {
  readonly submitter: PublicKey
  readonly idx: number

  static readonly discriminator = Buffer.from([
    220, 136, 1, 221, 134, 178, 41, 92,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("submitter"),
    borsh.u32("idx"),
  ])

  constructor(fields: ChoiceFields) {
    this.submitter = fields.submitter
    this.idx = fields.idx
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<Choice | null> {
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
  ): Promise<Array<Choice | null>> {
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

  static decode(data: Buffer): Choice {
    if (!data.slice(0, 8).equals(Choice.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Choice.layout.decode(data.slice(8))

    return new Choice({
      submitter: dec.submitter,
      idx: dec.idx,
    })
  }

  toJSON(): ChoiceJSON {
    return {
      submitter: this.submitter.toString(),
      idx: this.idx,
    }
  }

  static fromJSON(obj: ChoiceJSON): Choice {
    return new Choice({
      submitter: new PublicKey(obj.submitter),
      idx: obj.idx,
    })
  }
}
