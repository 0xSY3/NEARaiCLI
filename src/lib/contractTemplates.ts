export const CONTRACT_EXAMPLES = {
    token: {
      prompt: "Create a token with vesting and staking capabilities",
      description: "Advanced ERC-20 style token with vesting and staking features",
      code: `use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
  use near_sdk::collections::{LookupMap, UnorderedMap};
  use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};
  
  #[near_bindgen]
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct TokenContract {
      owner_id: AccountId,
      total_supply: Balance,
      balances: LookupMap<AccountId, Balance>,
      vesting_schedules: UnorderedMap<AccountId, VestingSchedule>,
      staking_positions: UnorderedMap<AccountId, StakingPosition>,
      rewards_per_token: Balance,
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct VestingSchedule {
      total_amount: Balance,
      start_timestamp: u64,
      duration: u64,
      claimed_amount: Balance,
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct StakingPosition {
      amount: Balance,
      start_timestamp: u64,
      accumulated_rewards: Balance,
      last_claim_timestamp: u64,
  }
  
  #[near_bindgen]
  impl TokenContract {
      #[init]
      pub fn new(owner_id: AccountId, total_supply: Balance) -> Self {
          let mut contract = Self {
              owner_id: owner_id.clone(),
              total_supply,
              balances: LookupMap::new(b"b"),
              vesting_schedules: UnorderedMap::new(b"v"),
              staking_positions: UnorderedMap::new(b"s"),
              rewards_per_token: 0,
          };
          contract.balances.insert(&owner_id, &total_supply);
          contract
      }
  
      pub fn create_vesting_schedule(
          &mut self,
          recipient: AccountId,
          amount: Balance,
          duration: u64,
      ) {
          assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner");
          let schedule = VestingSchedule {
              total_amount: amount,
              start_timestamp: env::block_timestamp(),
              duration,
              claimed_amount: 0,
          };
          self.vesting_schedules.insert(&recipient, &schedule);
      }
  
      pub fn stake(&mut self, amount: Balance) {
          let account_id = env::predecessor_account_id();
          let balance = self.balances.get(&account_id).unwrap_or(0);
          assert!(balance >= amount, "Not enough balance");
  
          let position = StakingPosition {
              amount,
              start_timestamp: env::block_timestamp(),
              accumulated_rewards: 0,
              last_claim_timestamp: env::block_timestamp(),
          };
  
          self.staking_positions.insert(&account_id, &position);
          self.balances.insert(&account_id, &(balance - amount));
      }
  
      pub fn claim_rewards(&mut self) -> Promise {
          let account_id = env::predecessor_account_id();
          let mut position = self.staking_positions.get(&account_id).expect("No staking position");
          
          let time_staked = env::block_timestamp() - position.last_claim_timestamp;
          let reward = (position.amount * time_staked as u128) / 1_000_000_000;
          
          position.accumulated_rewards += reward;
          position.last_claim_timestamp = env::block_timestamp();
          
          self.staking_positions.insert(&account_id, &position);
          
          Promise::new(account_id).transfer(reward)
      }
  }`,
    },
    
    dao: {
      prompt: "Create a DAO with proposal voting and treasury management",
      description: "Decentralized Autonomous Organization with governance features",
      code: `use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
  use near_sdk::collections::{LookupMap, UnorderedMap, Vector};
  use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub enum ProposalType {
      Transfer { recipient: AccountId, amount: Balance },
      UpdateConfig { key: String, value: String },
      AddMember { account_id: AccountId },
      RemoveMember { account_id: AccountId },
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub enum Vote {
      For,
      Against,
      Abstain,
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct Proposal {
      pub proposer: AccountId,
      pub description: String,
      pub proposal_type: ProposalType,
      pub votes_for: Balance,
      pub votes_against: Balance,
      pub status: ProposalStatus,
      pub start_time: u64,
      pub end_time: u64,
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub enum ProposalStatus {
      Active,
      Passed,
      Failed,
      Executed,
  }
  
  #[near_bindgen]
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct DAO {
      pub owner: AccountId,
      pub proposals: UnorderedMap<u64, Proposal>,
      pub votes: LookupMap<(u64, AccountId), Vote>,
      pub members: LookupMap<AccountId, Balance>,
      pub proposal_count: u64,
      pub quorum: Balance,
      pub voting_period: u64,
  }
  
  #[near_bindgen]
  impl DAO {
      #[init]
      pub fn new(owner: AccountId, quorum: Balance, voting_period: u64) -> Self {
          Self {
              owner,
              proposals: UnorderedMap::new(b"p"),
              votes: LookupMap::new(b"v"),
              members: LookupMap::new(b"m"),
              proposal_count: 0,
              quorum,
              voting_period,
          }
      }
  
      #[payable]
      pub fn create_proposal(
          &mut self,
          description: String,
          proposal_type: ProposalType,
      ) -> u64 {
          let proposer = env::predecessor_account_id();
          assert!(
              self.members.get(&proposer).is_some(),
              "Only members can create proposals"
          );
  
          let proposal_id = self.proposal_count;
          self.proposal_count += 1;
  
          let proposal = Proposal {
              proposer,
              description,
              proposal_type,
              votes_for: 0,
              votes_against: 0,
              status: ProposalStatus::Active,
              start_time: env::block_timestamp(),
              end_time: env::block_timestamp() + self.voting_period,
          };
  
          self.proposals.insert(&proposal_id, &proposal);
          proposal_id
      }
  
      pub fn vote(&mut self, proposal_id: u64, vote: Vote) {
          let voter = env::predecessor_account_id();
          let voting_power = self.members.get(&voter).expect("Not a member");
  
          let mut proposal = self.proposals.get(&proposal_id).expect("Proposal not found");
          assert!(
              matches!(proposal.status, ProposalStatus::Active),
              "Proposal not active"
          );
          assert!(
              env::block_timestamp() <= proposal.end_time,
              "Voting period ended"
          );
  
          // Record vote
          match vote {
              Vote::For => proposal.votes_for += voting_power,
              Vote::Against => proposal.votes_against += voting_power,
              _ => {},
          }
  
          self.votes.insert(&(proposal_id, voter), &vote);
          self.proposals.insert(&proposal_id, &proposal);
      }
  
      pub fn execute_proposal(&mut self, proposal_id: u64) -> Promise {
          let mut proposal = self.proposals.get(&proposal_id).expect("Proposal not found");
          assert!(
              matches!(proposal.status, ProposalStatus::Active),
              "Proposal not active"
          );
          assert!(
              env::block_timestamp() > proposal.end_time,
              "Voting period not ended"
          );
  
          let total_votes = proposal.votes_for + proposal.votes_against;
          assert!(total_votes >= self.quorum, "Quorum not reached");
  
          if proposal.votes_for > proposal.votes_against {
              proposal.status = ProposalStatus::Passed;
              match &proposal.proposal_type {
                  ProposalType::Transfer { recipient, amount } => {
                      Promise::new(recipient.clone()).transfer(*amount)
                  },
                  _ => Promise::new(env::current_account_id())
              }
          } else {
              proposal.status = ProposalStatus::Failed;
              Promise::new(env::current_account_id())
          }
      }
  }`,
    },
  
    gameNFT: {
      prompt: "Create a gaming NFT with attributes and leveling",
      description: "Advanced NFT implementation for gaming with character attributes",
      code: `use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
  use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};
  use near_sdk::json_types::Base64VecU8;
  use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct GameCharacter {
      level: u32,
      experience: u64,
      strength: u32,
      agility: u32,
      intelligence: u32,
      equipment: Vec<String>,
      achievements: UnorderedSet<String>,
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct NFTMetadata {
      title: Option<String>,
      description: Option<String>,
      media: Option<String>,
      media_hash: Option<Base64VecU8>,
      copies: Option<u64>,
      issued_at: Option<u64>,
      expires_at: Option<u64>,
      starts_at: Option<u64>,
      updated_at: Option<u64>,
      extra: Option<String>,
      reference: Option<String>,
      reference_hash: Option<Base64VecU8>,
  }
  
  #[near_bindgen]
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct GameNFTContract {
      pub owner_id: AccountId,
      pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<String>>,
      pub token_metadata: UnorderedMap<String, NFTMetadata>,
      pub characters: LookupMap<String, GameCharacter>,
  }
  
  #[near_bindgen]
  impl GameNFTContract {
      #[init]
      pub fn new(owner_id: AccountId) -> Self {
          Self {
              owner_id,
              tokens_per_owner: LookupMap::new(b"t"),
              token_metadata: UnorderedMap::new(b"m"),
              characters: LookupMap::new(b"c"),
          }
      }
  
      #[payable]
      pub fn mint_character(
          &mut self,
          token_id: String,
          metadata: NFTMetadata,
          receiver_id: AccountId,
      ) {
          assert!(
              env::attached_deposit() >= self.mint_cost(),
              "Not enough deposit"
          );
  
          // Create base character stats
          let character = GameCharacter {
              level: 1,
              experience: 0,
              strength: 10,
              agility: 10,
              intelligence: 10,
              equipment: Vec::new(),
              achievements: UnorderedSet::new(b"a"),
          };
  
          // Store character data
          self.characters.insert(&token_id, &character);
          
          // Store NFT metadata
          self.token_metadata.insert(&token_id, &metadata);
          
          // Add token to owner's set
          let mut tokens_set = self.tokens_per_owner
              .get(&receiver_id)
              .unwrap_or_else(|| UnorderedSet::new(b"o"));
          tokens_set.insert(&token_id);
          self.tokens_per_owner.insert(&receiver_id, &tokens_set);
      }
  
      pub fn level_up(&mut self, token_id: String) {
          let mut character = self.characters.get(&token_id).expect("Character not found");
          assert!(
              character.experience >= self.experience_required(character.level),
              "Not enough experience"
          );
  
          character.level += 1;
          character.strength += 2;
          character.agility += 2;
          character.intelligence += 2;
  
          self.characters.insert(&token_id, &character);
      }
  
      pub fn add_experience(&mut self, token_id: String, amount: u64) {
          assert_eq!(
              env::predecessor_account_id(),
              self.owner_id,
              "Only owner can add experience"
          );
  
          let mut character = self.characters.get(&token_id).expect("Character not found");
          character.experience += amount;
          self.characters.insert(&token_id, &character);
      }
  
      pub fn equip_item(&mut self, token_id: String, item_id: String) {
          let mut character = self.characters.get(&token_id).expect("Character not found");
          character.equipment.push(item_id);
          self.characters.insert(&token_id, &character);
      }
  
      pub fn add_achievement(&mut self, token_id: String, achievement_id: String) {
          let mut character = self.characters.get(&token_id).expect("Character not found");
          character.achievements.insert(&achievement_id);
          self.characters.insert(&token_id, &character);
      }
  
      // Helper functions
      fn mint_cost(&self) -> Balance {
          1_000_000_000_000_000_000_000 // 1 NEAR
      }
  
      fn experience_required(&self, level: u32) -> u64 {
          (level as u64 * 1000) * (level as u64 + 1)
      }
  }`,
    }
  };                