export const PEOPLE = [
  { name: "Matt", icon: "👨‍🚀" },
  { name: "ProxyAdmin", icon: "👩🏿‍✈️" },
  { name: "Governor", icon: "👨‍🎨" },
  { name: "Sofi", icon: "👸" },
  { name: "Suparman", icon: "👨🏾‍🎤" },
  { name: "Anna", icon: "🧝🏻‍♀️" },
  { name: "Attacker", icon: "👨🏻‍⚖️" },
];

export const CONTRACTS = [
  {
    name: "OUSD",
    icon: "🖲",
    isERC20: true,
    decimal: 18,
    actions: [
      {
        name: "Transfer",
        params: [
          { name: "To", type: "address" },
          { name: "Amount", token: "OUSD" },
        ],
      },
      {
        name: "Approve",
        params: [
          { name: "Allowed Spender", type: "address" },
          { name: "Amount", token: "OUSD" },
        ],
      },
    ],
  },
  {
    name: "Vault",
    icon: "🏦",
    actions: [
      {
        name: "Mint",
        params: [{ name: "Token", type: "erc20" }, { name: "Amount" }],
      },
      {
        name: "PauseDeposits",
        params: [],
      },
      {
        name: "UnpauseDeposits",
        params: [],
      },
      { name: "Rebase", params: [] },
      { name: "SupportAsset", params: [{ name: "Token", type: "erc20" }] },
    ],
  },
  {
    name: "USDC",
    icon: "💵",
    isERC20: true,
    decimal: 6,
    actions: [
      {
        name: "Transfer",
        params: [
          { name: "To", type: "address" },
          { name: "Amount", token: "USDC" },
        ],
      },
      {
        name: "Approve",
        params: [
          { name: "Allowed Spender", type: "address" },
          { name: "Amount", token: "USDC" },
        ],
      },
      { name: "Mint", params: [{ name: "Amount", token: "USDC" }] },
    ],
    contractName: "MockUSDC",
  },
  {
    name: "DAI",
    icon: "📕",
    isERC20: true,
    decimal: 18,
    actions: [
      {
        name: "Transfer",
        params: [
          { name: "To", type: "address" },
          { name: "Amount", token: "DAI" },
        ],
      },
      {
        name: "Approve",
        params: [
          { name: "Allowed Spender", type: "address" },
          { name: "Amount", token: "DAI" },
        ],
      },
      { name: "Mint", params: [{ name: "Amount", token: "DAI" }] },
    ],
    contractName: "MockDAI",
  },
  {
    name: "ORACLE",
    icon: "🐔",
    decimal: 6,
    actions: [
      {
        name: "SetPrice",
        params: [{ name: "Symbol" }, { name: "Price", token: "ORACLE" }],
      },
    ],
    contractName: "MockOracle",
  },
  {
    name: "CompoundDIA",
    icon: "D",
    contractName: "MockCDAI",
    actions: [],
  },
  {
    name: "CompoundUSDC",
    icon: "C",
    contractName: "MockCUSDC",
    actions: [],
  },
  {
    name: "COMP",
    icon: "*",
    contractName: "MockCOMP",
    isERC20: true,
    actions: [],
  },
];

export const SETUP = `
  Governor Vault unpauseDeposits
  Matt USDC mint 3000USDC
  Matt DAI mint 390000DAI
  Matt USDC approve Vault 9999999999USDC
  Matt DAI approve Vault 9999999999DAI
  Matt Vault mint DAI 1000DAI
  Sofi USDC mint 2000USDC
  Sofi USDC approve Vault 9999999999USDC
  Sofi Vault mint USDC 1000USDC
  Suparman USDC mint 1000USDC
  Anna USDC mint 1000USDC
  Attacker USDC mint 100000USDC
  Attacker USDC approve Vault 9999999USDC
`;

export const SCENARIOS = [
  {
    name: "Oracle lag attack, single asset",
    actions: `
      # If an oracle lags when the price goings down,
      # an attacker can purchase an asset from the real world,
      # put it into the contract,
      # exchanging it for OUSD at a discounted rate.
      # When the oracle is finaly up to date, the attacker 
      # can then withdraw more funds than they put in.
      Governor ORACLE setPrice "USDC" 2.00ORACLE
      Governor Vault rebase
      # At this point the real price of the asset changes
      # but the oracle is not yet updated.
      Attacker USDC approve Vault 2000USDC
      Attacker Vault mint USDC 2000USDC
      # Eventualy the price is updated to the true price
      Governor ORACLE setPrice "USDC" 1.00ORACLE
      Governor Vault rebase
      # And Attacker has more assets than he did before
    `,
  },
  {
    name: "Oracle lag: asset high",
    actions: `
      # If one asset is of higher value on the exchanges
      # than we have it priced at, then an attacker can
      # buy a normal priced asset, and replace it out.
      Governor ORACLE setPrice "USDC" 1.00ORACLE
      # At this point the real price of the asset changes
      # up but the oracle is not yet updated.
      Attacker Vault mint USDC 10000USDC
      # Eventualy the price is updated to the true price
      # If the attacker can do this, he can use a flash loan
      # to make a bigger attack
      Governor ORACLE setPrice "USDC" 1.02ORACLE
      Governor Vault rebase
      # And Attacker has more assets than he did before
      Attacker Vault redeem USDC 10000OUSD
    `,
  },
  {
    name: "Mint OGN",
    actions: `
    # Sofi mints 50 USD
    Sofi USDC approve Vault 50USDC  
    Sofi Vault mint USDC 50USDC
    `,
  },
];
