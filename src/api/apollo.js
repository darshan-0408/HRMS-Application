/**
 * Apollo Client v4 unified re-export shim.
 *
 * Apollo v4 splits into sub-packages (@apollo/client/react, /core, /link/*).
 * Importing from many different sub-paths confuses Vite's pre-bundler.
 * All application code imports from THIS file instead, giving Vite a single
 * stable entry point to trace dependencies from.
 */

// React hooks
export { useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client/react';

// Provider
export { ApolloProvider } from '@apollo/client/react';

// Core client
export { ApolloClient, InMemoryCache, from } from '@apollo/client/core';

// Links
export { createHttpLink } from '@apollo/client/link/http';
export { setContext } from '@apollo/client/link/context';
export { onError } from '@apollo/client/link/error';

// gql tag (ships with graphql-tag, re-exported by Apollo)
export { gql } from 'graphql-tag';
