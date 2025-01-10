// src/controllers/replayController.ts

import { Request, Response } from 'express';
import replayService from '../services/replayService';

export async function createReplay(req: Request, res: Response) {
    try {
        const { pairing_id, url, match_number } = req.body;
        const replay = await replayService.createReplay({ pairing_id, url, match_number });
        return res.status(201).json(replay);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Replay already exists',
            });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getReplays(req: Request, res: Response) {
    try {
        const { url, pairing_id } = req.params;
        const replays = await replayService.getReplays({
            url: url as string,
            pairing_id: pairing_id as string,
        });
        return res.json(replays);
    } catch (error: any) {
        return res.status(500).json({error: error.message });
    }
}

export async function deleteReplay(req: Request, res: Response) {
    try {
        const deleted = await replayService.deleteReplay(req.params.id);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Replay not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
