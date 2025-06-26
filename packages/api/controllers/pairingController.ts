import { Request, Response } from 'express';
import pairingService from '../services/pairingService';

export async function createPairing(req: Request, res: Response) {
    try {
        const newPairing = await pairingService.createPairing(req.body);
        return res.status(201).json(newPairing);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'A player in this pairing has already been paired for this round',
            });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getPairings(req: Request, res: Response) {
    try {
        const { round_id, tournament, round, player, discord_user, winner } = req.query;
        const pairings = await pairingService.getPairings({
            round_id: round_id as string,
            tournament: tournament as string,
            round: round as unknown as number,
            player: player as string,
            discord_user: discord_user as string,
            winner: winner as string,
        });
        return res.json(pairings);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getPairingById(req: Request, res: Response) {
    try {
        const pairing = await pairingService.getPairingById(req.params.id);
        if (!pairing) {
            return res.status(404).json({ error: 'Pairing not found' });
        }
        return res.json(pairing);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getRecentMatches(req: Request, res: Response) {
    try {
        const { player, page, limit } = req.query;
        const pairings = await pairingService.getRecentMatches({
            player: player as string,
            page: page as unknown as number,
            limit: limit as unknown as number,
        });
        if (!pairings) {
            return res.status(404).json({ error: 'Pairings not found' });
        }
        return res.json(pairings);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updatePairing(req: Request, res: Response) {
    try {
        const updatedPairing = await pairingService.updatePairing(req.params.id, req.body);
        if (!updatedPairing) {
            return res.status(404).json({ error: 'Pairing not found' });
        }
        return res.json(updatedPairing);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deletePairing(req: Request, res: Response) {
    try {
        const deleted = await pairingService.deletePairing(req.params.id);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Pairing not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
