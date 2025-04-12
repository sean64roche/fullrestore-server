import express from 'express';
import {
    createTournament,
    deleteTournament,
    getTournaments,
    getEntrantsByTournamentId,
    getRoundsByTournamentId,
    getTournamentById,
    updateTournament,
  } from '../controllers/tournamentController';
import {validateQueryParams} from "./validateQueryParams";

const router = express.Router();

router.post('/', router.post('/', createTournament));

router.get('/', validateQueryParams([
    'name',
    'season',
    'format',
    'individual_winner',
    'page',
    'limit'
]), getTournaments);

router.get('/:id', getTournamentById);

router.get('/:id/entrants', getEntrantsByTournamentId);

router.get('/:id/rounds', getRoundsByTournamentId);

router.put('/:id', updateTournament);

router.delete('/:id', deleteTournament);

export default router;