import express from 'express';
import Format from '../models/Format';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { format } = req.body;
        const newFormat = await Format.create({
            format: format
        });
        res.status(201).json(newFormat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const formats = await Format.findAll();
        res.json(formats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:format', async (req, res) => {
    try {
        const format = await Format.findByPk(req.params.format);
        if (format) {
            return res.json(format);
        } else {
            return res.status(404).json({ error: 'Format not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:format', async (req, res) => {
    try {
        const deleted = await Format.destroy({
            where: {format: req.params.format }
        });
        if (deleted) {
            return res.status(204).send();
        } else {
            return res.status(404).json({ error: 'Format not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;