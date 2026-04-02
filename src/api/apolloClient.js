import { ApolloClient, InMemoryCache, from, createHttpLink, setContext, onError } from './apollo.js';

// HTTP Link — uses Vite proxy (/graphql → http://localhost:4000/graphql)
// Relative URL means the browser makes same-origin requests → no CORS.
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Auth Link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('hrms_token');
  const tenantId = localStorage.getItem('tenant_id');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-tenant-id': tenantId || '',
    },
  };
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error(`[GraphQL error]: ${err.message}`);
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          listEmployees: { merge: false },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
    query: { fetchPolicy: 'network-only' },
  },
});

export default client;
