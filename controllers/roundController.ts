import { Request, Response } from 'express';
import RoundService, { RoundAttributes } from '../services/roundService';
import roundService from '../services/roundService';


export async function createRound(req: Request, res: Response) {
    try {
        const newRound = await roundService.createRound(req.body as RoundAttributes);
        return res.status(201).json(newRound);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Round already exists on this tournament' });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getRoundById(req: Request, res: Response) {
    try {
        const round = await RoundService.getRoundById(req.params.id);
        if (!round) {
            return res.status(404).json({ error: 'Round not found' });
        }
        return res.json(round);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getPairings(req: Request, res: Response) {
    try {
        const pairings = await RoundService.getPairingsByRoundId(req.params.id);
        return res.json(pairings);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateRound(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, deadline } = req.body;
        const updatedRound = await RoundService.updateRound(
            id,
            {
                name,
                deadline
            }

        );
        if (!updatedRound) {
            return res.status(404).json({ error: 'Round not found' });
        }
        return res.json(updatedRound);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteRound(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deleted = await RoundService.deleteRound(id);
        if (deleted) {
            return res.status(204).send();
        }
        return res.status(404).json({ error: 'Round record not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}