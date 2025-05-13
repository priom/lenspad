import { BigQuery } from '@google-cloud/bigquery';

// Initialize BigQuery client
export const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

export default bigquery;
