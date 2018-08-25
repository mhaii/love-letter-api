export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'test',
        type: 'bool'
      }
    ],
    name: 'PlayerBalanceInsufficient',
    type: 'event'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'player',
        type: 'address'
      }
    ],
    name: 'addPlayer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'applicableTargetPlayers',
        type: 'address[]'
      }
    ],
    name: 'GuessingPlayerHand',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'test',
        type: 'bool'
      }
    ],
    name: 'PlayerAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'player',
        type: 'address'
      }
    ],
    name: 'NextTurn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'loser',
        type: 'address'
      }
    ],
    name: 'PlayerLose',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'winner',
        type: 'address'
      }
    ],
    name: 'RoundEnded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'CaughtWithKingOrPrince',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'applicableTargetPlayers',
        type: 'address[]'
      }
    ],
    name: 'LookingAtHand',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'applicableTargetPlayers',
        type: 'address[]'
      }
    ],
    name: 'ComparingHands',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'PlayerProtectedUntilNextTurn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'applicableTargetPlayers',
        type: 'address[]'
      }
    ],
    name: 'DiscardingHand',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'applicableTargetPlayers',
        type: 'address[]'
      }
    ],
    name: 'TradingHands',
    type: 'event'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'player',
        type: 'address'
      }
    ],
    name: 'removePlayer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_cardId',
        type: 'uint8'
      },
      {
        name: '_currentPlayer',
        type: 'address'
      }
    ],
    name: 'useCard',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getDefaultDeck',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  }
]
