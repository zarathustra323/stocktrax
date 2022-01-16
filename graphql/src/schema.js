import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers/index.js';
import typeDefs from './definitions/index.js';
import {
  connectionProjectDirectiveTransformer,
  projectDirectiveTransformer,
} from './directives/index.js';
import { enumDefaultValuesTransformer } from './enums.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const withProjectSchema = projectDirectiveTransformer(schema);
const withConnectionProject = connectionProjectDirectiveTransformer(withProjectSchema);

// "hack" for handling enum default
const withEnumDefaults = enumDefaultValuesTransformer(withConnectionProject);

export default withEnumDefaults;
