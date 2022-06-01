use anchor_lang::prelude::*;
use std::collections::HashMap;
use anchor_spl::token::{TokenAccount, Mint};

use anchor_spl::token::{self,  Transfer};
declare_id!("HdGUGgAtzw6CGm4bB4DwNV6nUD9xHjBc8D6aSAheKZhd");

const ESCROW_ACCOUNT_PDA_SEED: &[u8] = b"escrow_12";

#[program]
pub mod staked_voting {
    use super::*;

    // Creates an account for the voting,set staking amount.
    pub fn initialize_voting(ctx: Context<Create>, stake_amount: u64, voter_count: i32) -> Result<()> {        
        let voter: &mut Account<Vote> = &mut ctx.accounts.voter;  
        let escrow_ac: &mut Account<TokenAccount> = &mut ctx.accounts.escrow_account;        
        voter.authority = ctx.accounts.admin.key();                
        voter.total_participants = voter_count;           
        voter.stake_amount = stake_amount;
        voter.voting_choice = Vec::new();
       msg!("init {:?}",escrow_ac.key());
        Ok(())
    }

     // Buy a candidate ticket
     pub fn vote_candidate(ctx: Context<Submit>,idx: u32) -> Result<()> {
        
        // Deserialize voter account and transfer amount, note the choice
        let voter: &mut Account<Vote> = &mut ctx.accounts.voter;          

        // Transfer lamports to the lottery account
        // let ix = anchor_lang::solana_program::system_instruction::transfer(
        //     &player.key(),
        //     &voter.key(),
        //     voter.stake_amount,
        // );
        // anchor_lang::solana_program::program::invoke(
        //     &ix,
        //     &[
        //         player.to_account_info(),
        //         voter.to_account_info(),
        //     ],
        // )?;

        // Stake tokens from voter account to escrow account.
        let cpi_accounts = Transfer {
            from: ctx.accounts.voter_ata.to_account_info().clone(),
            to: ctx.accounts.escrow_account.to_account_info().clone(),
            authority: ctx.accounts.player.to_account_info().clone(),
        };
        token::transfer(
            CpiContext::new(ctx.accounts.token_program.clone(), cpi_accounts),
            //voter.stake_amount,
            1,
        )?;
        // Save voter's
        voter.voting_choice.push(idx);       
        Ok(())  
    }

    // Iterate over all the votes and pick a winner.
    // Check for case of draw or no winners 
    pub fn pick_winner(ctx: Context<Winner>) -> Result<()> {

        // Deserialize voter account
        let voter: &mut Account<Vote> = &mut ctx.accounts.voter;
        let mut winner: HashMap<u32, u32> = HashMap::new();
        let mut max_count: u32= 0; 
        let mut max_index: u32= 0; 
        // Set winning index
        for key in &voter.voting_choice {
            let count = winner.entry(*key).or_insert(0);
            *count += 1;    
            if *count > max_count {
                max_count = *count;
                max_index = *key;
            }    
        }
        voter.winner = max_index;
        Ok(())
    } 

    // // Payout prize to the winner
    // pub fn pay_out_winner(ctx: Context<Payout>) -> Result<()> {

    //     // Check if it matches the winner address
    //     let lottery: &mut Account<Lottery> = &mut ctx.accounts.lottery;
    //     let recipient: &mut AccountInfo =  &mut ctx.accounts.winner;        

    //     // Get total money stored under original lottery account
    //     let balance: u64 = lottery.to_account_info().lamports();                      
            
    //     **lottery.to_account_info().try_borrow_mut_lamports()? -= balance;
    //     **recipient.to_account_info().try_borrow_mut_lamports()? += balance; 
        
    //     Ok(())
    // }
}

// Contexts
////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = admin, space = 8 + 180)]
    pub voter: Account<'info, Vote>,
    /// CHECK ignore this account
    pub token_program: AccountInfo<'info>,
    #[account(mut)]
    pub mint_account: Account<'info, Mint>,
    pub rent: Sysvar<'info, Rent>,
    #[account(
        init,
        seeds = [ESCROW_ACCOUNT_PDA_SEED],
        bump,
        payer = admin,
        token::mint = mint_account,
        token::authority = voter,
    )]
    pub escrow_account: Account<'info, TokenAccount>, // Program account to store data
    #[account(mut)]
    pub admin: Signer<'info>,    
    pub system_program: Program<'info, System>,
}

    // CHECK: This is not dangerous because we don't read or write from this account
    //pub token_program: AccountInfo<'info>,
#[derive(Accounts)]
pub struct Submit<'info> {    
    // #[account(init, 
    //     seeds = [
    //         player.key().as_ref()
    //     ], 
    //     constraint = player.to_account_info().lamports() >= voter.stake_amount,
    //     bump, 
    //     payer = player, 
    //     space=80
    // )]
    // pub choice: Account<'info, Choice>, 
    /// CHECK ignore this account
    pub token_program: AccountInfo<'info>,
    #[account(mut)] 
    pub voter_ata: Account<'info, TokenAccount>, // Program account to store data
    #[account(mut)] 
    pub escrow_account: Account<'info, TokenAccount>,
    #[account(mut)]                                 
    pub player: Signer<'info>,                     // Payer for account creation    
    #[account(mut)]       
    pub voter: Account<'info, Vote>,          // To retrieve and increment counter        
    pub system_program: Program<'info, System>,    
}

#[derive(Accounts)]
pub struct Winner<'info> {
    #[account(mut)]
    pub voter: Account<'info, Vote>,
    #[account(mut)]
    pub admin: Signer<'info>,    
    pub system_program: Program<'info, System>,
}
// Accounts
////////////////////////////////////////////////////////////////
// Ticket PDA
#[account]
#[derive(Default)] 
pub struct Choice {    
    pub submitter: Pubkey,    
    pub idx: u32,
}
// Voting account 
#[account]
pub struct Vote {    
    pub authority: Pubkey, 
    pub winner: u32,
    pub winner_count: u32,
    pub total_participants: i32,
    pub stake_amount: u64,
    pub voting_choice: Vec<u32>,
}