import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers/index.js';
import typeDefs from './definitions/index.js';
import { enumDefaultValuesTransformer } from './enums.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

// "hack" for handling enum default
const withEnumDefaults = enumDefaultValuesTransformer(schema);

export default withEnumDefaults;
