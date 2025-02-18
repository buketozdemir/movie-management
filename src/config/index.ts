import * as R from 'ramda';
import defaultConfig from './default';
import * as dotenv from 'dotenv';
import * as path from 'path';

export default () => {
  const p = path.join(__dirname, '..', '..', '.env');
  dotenv.config({ path: p });
  const env = process.env.NODE_ENV || 'local';
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const envSpecificConfig = require(`./environments/${env}`);
  return R.mergeDeepRight(defaultConfig(), envSpecificConfig);
};
