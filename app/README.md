# Solana Voting App

## Run

    yarn install
    yarn dev

## ReGenerate idl code

In case program changes have been made you need to update the typscript idl related code

    anchor-client-gen ../target/idl/*.json anchor/idl

    /* prerequisites */
    - idl created with `anchor build`
    - install generator with `yarn global add anchor-client-gen`
