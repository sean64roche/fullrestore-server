import { Request, Response } from 'express';
import contentService from "../services/contentService";

export async function createContent(req: Request, res: Response) {
    try {
        const { pairing_id, url, } = req.body;
        const replay = await contentService.createContent({ pairing_id, url });
        return res.status(201).json(replay);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Content already exists',
            });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getContent(req: Request, res: Response) {
    try {
        const {
            url,
            pairing_id,
        } = req.query;
        const replays = await contentService.getContent({
            url: url as string,
            pairing_id: pairing_id as string,
        });
        return res.json(replays);
    } catch (error: any) {
        return res.status(500).json({error: error.message });
    }
}

export async function deleteContent(req: Request, res: Response) {
    try {
        const deleted = await contentService.deleteContent(req.params.url);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Content not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
