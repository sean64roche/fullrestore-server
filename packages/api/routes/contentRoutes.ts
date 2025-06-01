import express from "express";
import {validateQueryParams} from "./validateQueryParams";
import {createContent, deleteContent, getContent} from "../controllers/contentController";

const router = express.Router();

router.post('/', createContent);

router.get('/', validateQueryParams(['url', 'pairing_id']), getContent);

router.delete('/:url', deleteContent);

export default router;