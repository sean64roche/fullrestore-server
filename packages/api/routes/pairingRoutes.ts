import express from 'express';
import {
  createPairing,
  getPairings,
  getPairingById,
  updatePairing,
  deletePairing,
  getRecentMatches,
} from '../controllers/pairingController';
import {validateQueryParams} from "./validateQueryParams";

const router = express.Router();

router.post('/', createPairing);

router.get('/', validateQueryParams(['round_id', 'tournament_slug', 'round', 'player', 'discord_user','discord_id', 'winner']), getPairings);

router.get('/recent', validateQueryParams(['player', 'page', 'limit']), getRecentMatches);

router.get('/:id', getPairingById);

router.put('/:id', updatePairing);

router.delete('/:id', deletePairing);

export default router;
