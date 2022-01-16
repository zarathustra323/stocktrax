import {
  cleanEnv,
  port,
  str,
} from 'envalid';

export const {
  EXPOSED_HOST,
  EXPOSED_PORT,
  HOST,
  IEX_CLOUD_PUBLISHABLE_API_TOKEN,
  MONGO_URL,
  PORT,
} = cleanEnv(process.env, {
  EXPOSED_HOST: str({ desc: 'The host that the service is exposed on.', default: '0.0.0.0' }),
  EXPOSED_PORT: port({ desc: 'The port that the service is exposed on.', default: 80 }),
  HOST: str({ desc: 'The host that the service will run on.', default: '0.0.0.0' }),
  IEX_CLOUD_PUBLISHABLE_API_TOKEN: str({ desc: 'The iexcloud.io publishable API token.' }),
  MONGO_URL: str({ desc: 'The MongoDB URL to connect to.' }),
  PORT: port({ desc: 'The port that the service will run on.', default: 80 }),
});
