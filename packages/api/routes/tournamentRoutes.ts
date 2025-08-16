import express from 'express';
import {
    createTournament,
    deleteTournament,
    getTournaments,
    getEntrantsByTournamentId,
    getTournamentById,
    updateTournament,
    getRoundsByTournamentSlug, searchTournaments,
} from '../controllers/tournamentController';
import {validateQueryParams} from "./validateQueryParams";

const router = express.Router();

router.post('/', router.post('/', createTournament));

router.get('/', validateQueryParams([
    'name',
    'season',
    'format',
    'individual_winner',
    'slug',
    'admin_snowflake',
    'signup_snowflake',
    'result_snowflake',
    'page',
    'limit'
]), getTournaments);

router.get('/search_tournament', validateQueryParams(['name', 'admin_snowflake', 'page', 'limit']), searchTournaments);

router.get('/:id', getTournamentById);

router.get('/:id/entrants', getEntrantsByTournamentId);

router.get('/:slug/rounds', getRoundsByTournamentSlug);

router.put('/:id', updateTournament);

router.delete('/:id', deleteTournament);

export default router;
