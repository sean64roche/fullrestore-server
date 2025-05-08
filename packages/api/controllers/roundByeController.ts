import { Request, Response } from 'express';
import { RoundByeAttributes } from '../services/roundByeService';
import roundByeService from '../services/roundByeService';

export async function createRoundBye(req: Request, res: Response) {
    try {
        const newRound = await roundByeService.createRoundBye(req.body as RoundByeAttributes);
        return res.status(201).json(newRound);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Player already has a bye record for this round' });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getRoundByeById(req: Request, res: Response) {
    try {
        const round = await roundByeService.getRoundByeById(req.params.id);
        if (!round) {
            return res.status(404).json({ error: 'Bye not found' });
        }
        return res.json(round);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteRoundBye(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const deleted = await roundByeService.deleteRoundBye(id);
        if (deleted) {
            return res.status(204).send();
        }
        return res.status(404).json({ error: 'Bye record not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}