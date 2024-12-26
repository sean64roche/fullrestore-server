import express from 'express';
import Replay from '../models/Replay';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'sequelize';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { pairing_id, url, match_number } = req.body;
        const newReplay = await Replay.create({
            id: uuidv4(),
            pairing_id,
            url,
            match_number
        });
        res.status(201).json(newReplay);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const replay = await Replay.findByPk(req.params.id);
        if (replay) {
            return res.json(replay);
        } else {
            return res.status(404).json({ error: 'Replay not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Replay.destroy({
        where: { id: req.params.id }
      });
  
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: 'Replay not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;