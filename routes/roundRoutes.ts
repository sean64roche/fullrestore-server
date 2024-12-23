import express from 'express';
import Round from '../models/Round';
import Pairing from '../models/Pairing';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { tournament_id, round, name, deadline } = req.body;
        const newRound = await Round.create({
            id: uuidv4(),
            tournament_id,
            round,
            name,
            deadline
        });
        res.status(201).json(newRound);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({
                error: 'Round already exists on this tournament'
            });
        }
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const round = await Round.findByPk(req.params.id);
        if (round) {
            res.json(round);
        } else {
            res.status(404).json({ error: 'Round not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/pairings', async (req, res) => {
    try {
        const pairings = await Pairing.findAll({
            where: {
                round_id: req.params.id
            },
            order: [['time_completed', 'DESC']]
        });
        res.json(pairings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, deadline } = req.body;
        const [updated] = await Round.update(
            { name, deadline },
            { where: { id: req.params.id } }
        );
        if (updated) {
            const round = await Round.findByPk(req.params.id);
            res.json(round);
        } else {
            res.status(404).json({ error: 'Round not found'});
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;