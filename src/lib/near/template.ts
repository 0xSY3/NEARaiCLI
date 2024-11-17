export const NEAR_TEMPLATES = {
    rust: {
      token: `use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
  use near_sdk::collections::LookupMap;
  use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};
  
  #[near_bindgen]
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct Token {
      owner_id: AccountId,
      total_supply: Balance,
      balances: LookupMap<AccountId, Balance>,
  }
  
  impl Default for Token {
      fn default() -> Self {
          env::panic_str("Token should be initialized before usage")
      }
  }
  
  #[near_bindgen]
  impl Token {
      #[init]
      pub fn new(owner_id: AccountId, total_supply: Balance) -> Self {
          let mut token = Self {
              owner_id,
              total_supply,
              balances: LookupMap::new(b"b"),
          };
          token.balances.insert(&token.owner_id, &token.total_supply);
          token
      }
  
      pub fn transfer(&mut self, recipient: AccountId, amount: Balance) {
          let sender = env::predecessor_account_id();
          let sender_balance = self.balances.get(&sender).unwrap_or(0);
          assert!(sender_balance >= amount, "Not enough balance");
          
          let recipient_balance = self.balances.get(&recipient).unwrap_or(0);
          self.balances.insert(&sender, &(sender_balance - amount));
          self.balances.insert(&recipient, &(recipient_balance + amount));
      }
  
      pub fn get_balance(&self, account_id: AccountId) -> Balance {
          self.balances.get(&account_id).unwrap_or(0)
      }
  }`,
  
      nft: `use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
  use near_sdk::collections::{LookupMap, UnorderedMap};
  use near_sdk::json_types::U128;
  use near_sdk::{env, near_bindgen, AccountId};
  
  #[near_bindgen]
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct NFTContract {
      owner_id: AccountId,
      tokens: UnorderedMap<String, Token>,
      token_to_owner: LookupMap<String, AccountId>,
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct Token {
      owner_id: AccountId,
      metadata: TokenMetadata,
  }
  
  #[derive(BorshDeserialize, BorshSerialize)]
  pub struct TokenMetadata {
      title: Option<String>,
      description: Option<String>,
      media: Option<String>,
  }
  
  #[near_bindgen]
  impl NFTContract {
      #[init]
      pub fn new(owner_id: AccountId) -> Self {
          Self {
              owner_id,
              tokens: UnorderedMap::new(b"t"),
              token_to_owner: LookupMap::new(b"o"),
          }
      }
  
      pub fn mint(&mut self, token_id: String, metadata: TokenMetadata) {
          assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner can mint");
          let token = Token {
              owner_id: self.owner_id.clone(),
              metadata,
          };
          self.tokens.insert(&token_id, &token);
          self.token_to_owner.insert(&token_id, &self.owner_id);
      }
  
      pub fn transfer(&mut self, receiver_id: AccountId, token_id: String) {
          let sender_id = env::predecessor_account_id();
          let owner_id = self.token_to_owner.get(&token_id).expect("Token not found");
          assert_eq!(owner_id, sender_id, "Sender must be the owner");
          
          self.token_to_owner.insert(&token_id, &receiver_id);
          let mut token = self.tokens.get(&token_id).expect("Token not found");
          token.owner_id = receiver_id;
          self.tokens.insert(&token_id, &token);
      }
  }`,
    },
  
    assemblyscript: {
      token: `import { storage, Context, logging, u128 } from "near-sdk-as";
  
  @nearBindgen
  export class Token {
    owner_id: string;
    total_supply: u128;
    balances: Map<string, u128> = new Map();
  
    constructor(owner_id: string, total_supply: u128) {
      this.owner_id = owner_id;
      this.total_supply = total_supply;
      this.balances.set(owner_id, total_supply);
    }
  
    transfer(recipient: string, amount: u128): void {
      const sender = Context.sender;
      const sender_balance = this.balances.get(sender) || u128.Zero;
      assert(u128.ge(sender_balance, amount), "Not enough balance");
      
      const recipient_balance = this.balances.get(recipient) || u128.Zero;
      this.balances.set(sender, u128.sub(sender_balance, amount));
      this.balances.set(recipient, u128.add(recipient_balance, amount));
    }
  
    get_balance(account_id: string): u128 {
      return this.balances.get(account_id) || u128.Zero;
    }
  }`
    }
  };