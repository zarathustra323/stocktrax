import { ApolloServer } from 'apollo-server-fastify';
import { STATUS_CODES } from 'http';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import fastify from 'fastify';
import { get, set } from '@stocktrax/object-path';
import { CloseFastifyPlugin, CorePlugin, OnShutdownPlugin } from './plugins/index.js';
import schema from './schema.js';

const isProduction = process.env.NODE_ENV === 'production';

const codes = {
  BAD_USER_INPUT: 400,
  GRAPHQL_PARSE_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  GRAPHQL_VALIDATION_FAILED: 422,
};

export default async (options = {}) => {
  const app = fastify(options.fastify);
  const apollo = new ApolloServer({
    schema,
    introspection: true,
    debug: !isProduction,
    plugins: [
      isProduction
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
      CloseFastifyPlugin(app),
      ApolloServerPluginDrainHttpServer({
        httpServer: app.server,
        stopGracePeriodMillis: process.env.SHUTDOWN_GRACE_PERIOD,
      }),
      OnShutdownPlugin({ fn: options.onShutdown }),
      CorePlugin(),
    ],
    formatError: (err) => {
      const statusCode = get(err, 'extensions.exception.statusCode');
      const code = get(err, 'extensions.code');

      if (statusCode) set(err, 'extensions.code', STATUS_CODES[statusCode].replace(/\s/g, '_').toUpperCase());
      if (codes[code]) set(err, 'extensions.exception.statusCode', codes[code]);

      if (get(err, 'extensions.exception.statusCode', 500) >= 500) {
        // this doesn't respect ignored codes, so only send actual errors.
        // @todo log the errors
      }
      return err;
    },
  });

  await apollo.start();
  app.register(apollo.createHandler({
    path: '/',
    onHealthCheck: options.onHealthCheck,
  }));
  return app;
};
