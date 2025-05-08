import express from 'express';
import {
  createReplay,
  deleteReplay,
  getReplays,
} from '../controllers/replayController';
import {validateQueryParams} from "./validateQueryParams";

const router = express.Router();

router.post('/', createReplay);

router.get('/', validateQueryParams(['url', 'pairing_id', 'match_number']), getReplays);

router.delete('/:url', deleteReplay);

export default router;
