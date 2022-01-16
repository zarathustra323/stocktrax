import { get, getAsArray } from '@stocktrax/object-path';
import { mapSchema, MapperKind } from '@graphql-tools/utils';

export const enums = {};

export function getValue(path, throwOnNotFound = false) {
  const value = get(enums, path);
  if (throwOnNotFound && !value) throw new Error(`Unable to find enum value for path ${path}`);
  return value;
}

export function enumDefaultValuesTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.ENUM_TYPE]: (config) => {
      getAsArray(config, '_values').forEach((valueObj) => {
        const path = `${config}.${valueObj.name}`;
        const defaultValue = getValue(path);
        if (defaultValue) valueObj.value = defaultValue; // eslint-disable-line no-param-reassign
      });
    },
  });
}
