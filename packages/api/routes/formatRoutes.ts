import express from 'express';
import { 
    createFormat, 
    getAllFormats, 
    getFormat, 
    deleteFormat 
} from '../controllers/formatController';

const router = express.Router();

router.post('/', createFormat);

router.get('/', getAllFormats);

router.get('/:format', getFormat);

router.delete('/:format', deleteFormat);

export default router;