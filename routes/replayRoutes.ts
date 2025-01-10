import express from 'express';
import {
  createReplay,
  deleteReplay,
  getReplays,
} from '../controllers/replayController';
import {validateQueryParams} from "./validateQueryParams";

const router = express.Router();

router.post('/', createReplay);

router.get('/', validateQueryParams(['url', 'pairing_id']), getReplays);

router.delete('/:id', deleteReplay);

export default router;
