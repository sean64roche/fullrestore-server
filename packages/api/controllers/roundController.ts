import { Request, Response } from 'express';
import { RoundAttributes } from '../services/roundService';
import roundService from '../services/roundService';


export async function createRound(req: Request, res: Response) {
    try {
        const newRound = await roundService.createRound(req.body as RoundAttributes);
        return res.status(201).json(newRound);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Round already exists on this tournament' });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getRounds(req: Request, res: Response) {
    try {
        const { tournament_slug, round, name } = req.query;
        const rounds = await roundService.getRounds({
            tournament_slug: tournament_slug as string,
            round: round as unknown as number,
            name: name as string,
        });
        return res.json(rounds);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getRoundById(req: Request, res: Response) {
    try {
        const round = await roundService.getRoundById(req.params.id);
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
        const pairings = await roundService.getPairingsByRoundId(req.params.id);
        return res.json(pairings);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getByes(req: Request, res: Response) {
    try {
        const byes = await roundService.getByesByRoundId(req.params.id);
        return res.json(byes);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateRound(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, deadline } = req.body;
        const updatedRound = await roundService.updateRound(
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
        const deleted = await roundService.deleteRound(id);
        if (deleted) {
            return res.status(204).send();
        }
        return res.status(404).json({ error: 'Round record not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}