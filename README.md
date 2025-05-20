# LensPad

LensPad is an ICO launch platform that’s powered by reputation and community. Easily create an ICO and crowdfund your coin and get a reputation based on your lens profile!    
Launch your token — You fill out a form with name, symbol, price, duration, and whether you want to mint a new ERC-20 token or use your own.
Sell it to anyone — People can visit your sale page, see your reputation based off of your lens profile and social history, and invest with one click with our own built reputation score system.

# Future features 

Lens Integration
- We want to have lens profile integrated so that we can see the different users backing tokens they support

Lens groups
- A lens group will be created when the ICO is created 
- Auto-join the ICO Lens Group after a user contributes 
- Token holders form a social DAO instantly


Transparency Dashboard

- Display real-time contributions (who invested, how much)


# Reputation Score Metrics Overview 

This score provides a holistic view of a creator's on-chain activity and engagement on the Lens Chain. It is calculated based on the following metrics, which are normalized and weighted:

*   **Total Transaction Volume:**
    *   Measures the overall number of transactions initiated by the creator.
    *   *Significance:* Reflects general on-chain activity level.

*   **Activity Lifespan:**
    *   Calculates the time duration (in days) between the creator's first and last recorded transaction.
    *   *Significance:* Indicates long-term presence and potential commitment to the network.

*   **Smart Contract Interaction Ratio:**
    *   Determines the proportion of the creator's transactions that interact with smart contracts (have input data) versus simple native token transfers.
    *   *Significance:* Suggests engagement with dApps and protocols rather than just basic transfers.

*   **Contracts Deployed:**
    *   Counts the number of unique smart contracts successfully deployed by the creator.
    *   *Significance:* Highlights developer/builder activity on the network.

*   **dApp Interaction Diversity:**
    *   Counts the number of distinct smart contract addresses the creator has interacted with.
    *   *Significance:* Shows the breadth of the creator's engagement across different applications and protocols.

*   **Activity Consistency (Active Months):**
    *   Counts the number of distinct months in which the creator submitted at least one transaction.
    *   *Significance:* Rewards regular, sustained participation over potentially infrequent bursts of activity.

*   **Contract Events Triggered:**
    *   Counts the total number of log events emitted by smart contracts resulting from the creator's transactions.
    *   *Significance:* Acts as a proxy for the impact or complexity of the user's interactions with smart contracts.

**Calculation Note:**
*   Each raw metric is normalized (scaled, often logarithmically for counts, or as a ratio) to allow fair comparison.
*   These normalized metrics are then combined using specific weights (reflecting perceived importance) to produce a final reputation score, typically out of 100.


## Run Server
- pnpm i
- pnpm run dev


### Test Query
```
curl -X POST http://localhost:3000/api/bigquery/query \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT creator_address_web3, reputation_score FROM `priom-sidekick.lens_mainnet_dataset.lens_mainnet_repscore` LIMIT 10"}' | jq

### GCP Hosted
curl -X POST https://lens-bigquery-api-84180858304.us-central1.run.app/api/bigquery/query \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT creator_address_web3, reputation_score FROM `priom-sidekick.lens_mainnet_dataset.lens_mainnet_repscore` LIMIT 10"}' | jq
