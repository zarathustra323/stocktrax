import {
  cleanEnv,
  str,
} from 'envalid';

export const {
  IEX_CLOUD_PUBLISHABLE_API_TOKEN,
  MONGO_URL,
} = cleanEnv(process.env, {
  IEX_CLOUD_PUBLISHABLE_API_TOKEN: str({ desc: 'The iexcloud.io publishable API token.' }),
  MONGO_URL: str({ desc: 'The MongoDB URL to connect to.' }),
});
