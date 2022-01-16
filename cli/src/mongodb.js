import { MongoDBClient } from '@stocktrax/mongodb';
import { MONGO_URL } from './env.js';

export default new MongoDBClient({ url: MONGO_URL });
