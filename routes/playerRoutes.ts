import express from 'express';
import Player from '../models/Player';
import { v4 as uuidv4 } from 'uuid';
import EntrantPlayer from '../models/EntrantPlayer';

const router = express.Router();

// Create a new player
router.post('/', async (req, res) => {
  try {
    const { ps_user, discord_user } = req.body;
    const newPlayer = await Player.create({
      id: uuidv4(),
      ps_user,
      discord_user
    });
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (player) {
      return res.json(player);
    } else {
      return res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player's entrant records
router.get('/:id/competitions', async (req, res) => {
  try {
    const competitions = await EntrantPlayer.findAll({
      where: {
        player_id: req.params.id
      },
    });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update player
router.put('/:id', async (req, res) => {
  try {
    const { ps_user, discord_user } = req.body;
    const [updated] = await Player.update(
      { ps_user, discord_user },
      { where: { id: req.params.id } }
    );

    if (updated) {
      const updatedPlayer = await Player.findByPk(req.params.id);
      return res.json(updatedPlayer);
    } else {
      return res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete player
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Player.destroy({
      where: { id: req.params.id }
    });

    if (deleted) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;