import { asArray } from '@cms-apis/utils';
import get from './get.js';

/**
 * Gets an object path value (via dot-notation) as an array.
 *
 * @param {object} obj
 * @param {string} path
 * @returns {array}
 */
export default (obj, path) => asArray(get(obj, path, []));
