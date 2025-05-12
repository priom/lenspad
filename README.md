# lens-spring-hack

**Reputation Score Metrics Overview**

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