import { Request, Response } from 'express';
import formatService, { FormatAttributes } from "../services/formatService";

export async function createFormat(req: Request, res: Response) {
    try {
        const newFormat = await formatService.createFormat(req.body as FormatAttributes)
        return res.status(201).json(newFormat);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Format already exists',
            });
        }
        return res.status(400).json({ error: error.message });    }
}

export async function getAllFormats(req: Request, res: Response) {
    try {
        const formats = await formatService.getAllFormats();
        return res.json(formats);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getFormat(req: Request, res: Response) {
    try {
        const { format } = req.params;
        const result = await formatService.getFormat(format);
        if (!result) {
            return res.status(404).json({ error: 'Format not found.' }); 
        }
        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function deleteFormat(req: Request, res: Response) {
    try {
        const { format } = req.params;
        const deleted = await formatService.deleteFormat(format);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Tournament not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}