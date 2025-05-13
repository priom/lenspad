import express from 'express';
import { runQuery, getDatasets } from '../controllers/bigquery.controller';

const router = express.Router();

router.post('/query', runQuery);
// router.get('/datasets', getDatasets);

export default router;
