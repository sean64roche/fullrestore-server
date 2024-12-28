import express from 'express';
import {
    createTournament,
    deleteTournament,
    getAllTournaments,
    getEntrantsByTournamentId,
    getRoundsByTournamentId,
    getTournamentById,
    updateTournament,
  } from '../controllers/tournamentController';

const router = express.Router();

router.post('/', router.post('/', createTournament));

router.get('/', getAllTournaments);

router.get('/:id', getTournamentById);

router.get('/:id/entrants', getEntrantsByTournamentId);

router.get('/:id/rounds', getRoundsByTournamentId);

router.put('/:id', updateTournament);

router.delete('/:id', deleteTournament);

export default router;