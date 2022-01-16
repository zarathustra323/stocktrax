import Repos from '../mongodb/repos.js';
import iexcloud from '../iexcloud.js';

const isIntrospectionQuery = (operation) => operation.selectionSet.selections.every((selection) => {
  const fieldName = selection.name.value;
  return fieldName.startsWith('__');
});

export default function CorePlugin() {
  return {
    requestDidStart() {
      return {
        async didResolveOperation(requestContext) {
          const { context, operation } = requestContext;

          // let introspection queries pass through.
          if (isIntrospectionQuery(operation)) return;

          context.iexcloud = iexcloud;
          context.repos = Repos();
        },
      };
    },
  };
}
