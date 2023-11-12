const assert = require('assert');
const { generateWorld, initBlockchainConnection, tokenizeCurrency, executeSmartContract } = require('../js/utils/helpers');
const { WORLD_SEED, BLOCKCHAIN_PROVIDER, IN_GAME_CURRENCY, SMART_CONTRACTS } = require('../js/utils/constants');
const { PlayerWorldSchema, TransactionSchema } = require('../server/models');

describe('Integration Tests for Realms of Arithia', function() {
  describe('3D World Generation', function() {
    it('should create a unique 3D world based on a given seed', function() {
      const world = generateWorld(WORLD_SEED);
      assert.strictEqual(world.seed, WORLD_SEED);
      assert.ok(world.hasOwnProperty('terrain'));
      assert.ok(world.hasOwnProperty('climate'));
    });
  });

  describe('Blockchain Integration', function() {
    let blockchainConnection;

    before(function() {
      blockchainConnection = initBlockchainConnection(BLOCKCHAIN_PROVIDER);
    });

    it('should connect to the Arbitrum blockchain', function() {
      assert.ok(blockchainConnection.isConnected);
    });

    it('should tokenize in-game currency', function() {
      const token = tokenizeCurrency(IN_GAME_CURRENCY, blockchainConnection);
      assert.strictEqual(token.currency, IN_GAME_CURRENCY);
      assert.ok(token.hasOwnProperty('balance'));
      assert.ok(token.hasOwnProperty('transactions'));
    });

    it('should execute smart contracts for in-game transactions', function() {
      const contractExecutionResult = executeSmartContract(SMART_CONTRACTS.purchase, blockchainConnection);
      assert.ok(contractExecutionResult.success);
    });
  });

  describe('Player World Ownership', function() {
    it('should have a valid schema for player world data', function() {
      const playerWorldData = new PlayerWorldSchema({
        owner: 'player1',
        worldData: generateWorld(WORLD_SEED)
      });
      assert.strictEqual(playerWorldData.owner, 'player1');
      assert.ok(playerWorldData.worldData);
    });
  });

  describe('Blockchain Transactions', function() {
    it('should have a valid schema for blockchain transactions', function() {
      const transactionData = new TransactionSchema({
        from: 'player1',
        to: 'player2',
        amount: 100,
        currency: IN_GAME_CURRENCY,
        status: 'pending'
      });
      assert.strictEqual(transactionData.from, 'player1');
      assert.strictEqual(transactionData.to, 'player2');
      assert.strictEqual(transactionData.amount, 100);
      assert.strictEqual(transactionData.currency, IN_GAME_CURRENCY);
      assert.strictEqual(transactionData.status, 'pending');
    });
  });
});