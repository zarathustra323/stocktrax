import { get, getAsArray } from '@stocktrax/object-path';
import { mapSchema, MapperKind } from '@graphql-tools/utils';

export const enums = {
  /**
   *
   */
  PaginationMethodEnum: {
    CURSOR: 'cursor',
    OFFSET: 'offset',
  },

  /**
   *
   */
  QueryExchangesSortFieldEnum: {
    ID: '_id',
    DESCRIPTION: 'fullDescription',
    FULL_NAME: 'fullName',
    NAME: 'name',
    SEGMENT: 'segment',
  },

  /**
   *
   */
  QuerySymbolsSortFieldEnum: {
    ID: '_id',
    NAME: 'name',
    SYMBOL: 'symbol',
  },

  /**
   *
   */
  QueryTransactionsSortFieldEnum: {
    ID: '_id',
    DATE: 'date',
    SYMBOL: 'symbol',
  },

  /**
   *
   */
  SortOrderEnum: {
    ASC: 1,
    DESC: -1,
  },
};

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
