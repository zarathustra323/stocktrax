import IEXCloudApiClient from '@stocktrax/iexcloud.io';
import { IEX_CLOUD_PUBLISHABLE_API_TOKEN } from './env.js';

export default new IEXCloudApiClient({
  publishableToken: IEX_CLOUD_PUBLISHABLE_API_TOKEN,
});
