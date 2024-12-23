import express from 'express';
import EntrantPlayer from '../models/EntrantPlayer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { player_id, tournament_id, entrant_team_id, active, wins, losses, max_round, seed } = req.query;
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
        res.status(201).json(entrant);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({
                error: 'Entrant record already exists for this tournament'
            });
        }
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const entrant = await EntrantPlayer.findByPk(req.params.id);
        if (entrant) {
            res.json(entrant);
        } else {
            res.status(404).json({ error: 'Player entrant record not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/active_competitors', async (req, res) => {
    try {
        const activeEntrant = await EntrantPlayer.findAll({
            where: {
                active: true
            },
            order: [['tournament_id', 'ASC']]
        });
        res.json(activeEntrant);
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
            res.json(entrant);
        } else {
            res.status(404).json({ error: 'Player entrant record not found'});
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;