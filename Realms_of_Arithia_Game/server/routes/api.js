const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const worldService = require('../services/worldService');
const aiService = require('../services/aiService');
const eventService = require('../services/eventService');

// Endpoint to generate a new 3D world for a player
router.post('/generateWorld', async (req, res) => {
  try {
    const { userId, seed } = req.body;
    const worldData = await worldService.generateWorld(userId, seed);
    res.status(201).json(worldData);
  } catch (error) {
    res.status(500).json({ message: 'Error generating world', error: error.message });
  }
});

// Endpoint to handle blockchain transactions
router.post('/transaction', async (req, res) => {
  try {
    const { from, to, amount, token } = req.body;
    const transactionResult = await blockchainService.processTransaction(from, to, amount, token);
    res.status(200).json(transactionResult);
  } catch (error) {
    res.status(500).json({ message: 'Error processing transaction', error: error.message });
  }
});

// Endpoint to create an AI companion for a player
router.post('/createAICompanion', async (req, res) => {
  try {
    const { userId, settings } = req.body;
    const aiCompanion = await aiService.createAICompanion(userId, settings);
    res.status(201).json(aiCompanion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating AI companion', error: error.message });
  }
});

// Endpoint to integrate real-world data into the game
router.post('/integrateRealWorldData', async (req, res) => {
  try {
    const { eventType, data } = req.body;
    const eventResult = await eventService.integrateRealWorldData(eventType, data);
    res.status(200).json(eventResult);
  } catch (error) {
    res.status(500).json({ message: 'Error integrating real-world data', error: error.message });
  }
});

// Endpoint to get player's world data
router.get('/world/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const worldData = await worldService.getWorldData(userId);
    res.status(200).json(worldData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving world data', error: error.message });
  }
});

module.exports = router;