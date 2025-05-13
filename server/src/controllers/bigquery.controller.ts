import { Request, Response } from 'express';
import bigquery from '../config/bigquery';

export const runQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    // Run the query
    const [rows] = await bigquery.query({
      query: query,
      location: 'US', // Replace with your dataset location if different
    });

    res.status(200).json({ results: rows });
  } catch (error: any) {
    console.error('Error executing BigQuery:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getDatasets = async (req: Request, res: Response): Promise<void> => {
  try {
    const [datasets] = await bigquery.getDatasets();
    res.status(200).json({ 
      datasets: datasets.map(dataset => dataset.id) 
    });
  } catch (error: any) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: error.message });
  }
};
