import express from 'express';
import Pairing from '../models/Pairing';
import { v4 as uuidv4 } from 'uuid';
import Replay from '../models/Replay';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { round_id, entrant1_id, entrant2_id, time_scheduled, time_completed, winner_id } = req.body;
        const newPairing = await Pairing.create({
            id: uuidv4(),
            round_id,
            entrant1_id,
            entrant2_id,
            time_scheduled,
            time_completed,
            winner_id
        });
        return res.status(201).json(newPairing);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: 'Round already exists on this tournament'
            });
        }
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const pairing = await Pairing.findByPk(req.params.id, {
            include: [
                {
                    model: Replay,
                    attributes: ['match_number', 'url', 'id'],
                    order: [['match_number', 'ASC']]
                }
            ]
        });
        if (pairing) {
            return res.json(pairing);
        } else {
            return res.status(404).json({ error: 'Pairing not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { round_id, entrant1_id, entrant2_id, time_scheduled, time_completed, winner_id } = req.body;
        const [updated] = await Pairing.update(
            { round_id, entrant1_id, entrant2_id, time_scheduled, time_completed, winner_id },
            { where: { id: req.params.id } }
        );
        if (updated) {
            const updatedPairing = await Pairing.findByPk(req.params.id);
            return res.json(updatedPairing);
        } else {
            return res.status(404).json({ error: 'Pairing not found' });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Pairing.destroy({
        where: { id: req.params.id }
      });
  
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: 'Pairing not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;