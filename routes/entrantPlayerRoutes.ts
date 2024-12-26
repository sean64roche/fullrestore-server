import express from 'express';
import EntrantPlayer from '../models/EntrantPlayer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { player_id, tournament_id, entrant_team_id, active, wins, losses, max_round, seed } = req.body;
        const entrant = await EntrantPlayer.create({
            id: uuidv4(),
            player_id,
            tournament_id,
            entrant_team_id,
            active,
            wins,
            losses,
            max_round,
            seed
        });
        return res.status(201).json(entrant);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: 'Entrant record already exists for this tournament'
            });
        }
        res.status(400).json({ error: error.message });
    }
});

router.get('/active', async (req, res) => {
    try {
        const activeEntrants = await EntrantPlayer.findAll({
            where: {
                active: true
            },
            order: [['tournament_id', 'ASC']]
        });
        res.json(activeEntrants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const entrant = await EntrantPlayer.findByPk(req.params.id);
        if (entrant) {
            return res.json(entrant);
        } else {
            return res.status(404).json({ error: 'Player entrant record not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { player_id, tournament_id, entrant_team_id, active, wins, losses, max_round, seed } = req.body;
        const [updated] = await EntrantPlayer.update(
            { player_id, tournament_id, entrant_team_id, active, wins, losses, max_round, seed },
            { where: { id: req.params.id } }
        );
        if (updated) {
            const entrant = await EntrantPlayer.findByPk(req.params.id);
            return res.json(entrant);
        } else {
            return res.status(404).json({ error: 'Player entrant record not found'});
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleted = await EntrantPlayer.destroy({
        where: { id: req.params.id }
      });
  
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: 'Entrant record not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;