import express from 'express';
import Tournament from '../models/Tournament';
import Round from '../models/Round';
import EntrantPlayer from '../models/EntrantPlayer';
import { v4 as uuidv4 } from 'uuid';


const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, season, format, current_round, prize_pool, individual_winner, team_tour, team_winner } = req.body;
        const newTournament = await Tournament.create({
            id: uuidv4(),
            name,
            season,
            format,
            current_round,
            prize_pool,
            individual_winner,
            team_tour,
            team_winner
        });
        res.status(201).json(newTournament);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({
                error: 'A tournament with this name and season already exists'
            });
        }
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { format, season } = req.query;
        const queryOptions: any = {
            where: {}
        };
        if (format) queryOptions.where.format = format;
        if (season) queryOptions.where.season = season;
        const tournaments = await Tournament.findAll(queryOptions);
        return res.json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findByPk(req.params.id);
        if (!tournament) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        return res.json(tournament);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/entrants', async (req, res) => {
    try {
        const entrants = await EntrantPlayer.findAll({
            where: {
                tournament_id: req.params.id,
                // active: true
            },
            order: [['seed', 'ASC']]
        });
        res.json(entrants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/rounds', async (req, res) => {
    try {
        const rounds = await Round.findAll({
            where: {
                tournament_id: req.params.id,
            },
            order: [['round', 'ASC']]
        });
        res.json(rounds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { current_round, prize_pool, individual_winner, team_winner } = req.body;
        const [updated] = await Tournament.update(
             { current_round, prize_pool, individual_winner, team_winner },
             { where: {id: req.params.id }}
        );
        if (updated) {
            const tournament = await Tournament.findByPk(req.params.id);
            return res.json(tournament);
        } else {
            return res.status(404).json({ error: 'Tournament not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Tournament.destroy({
        where: { id: req.params.id }
      });
  
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: 'Tournament not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;