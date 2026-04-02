import 'dotenv/config';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import connectDB from './config/db.js';
import { typeDefs, resolvers } from './schema.js';
import { contextStore } from './config/contextStore.js';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS must be applied GLOBALLY (before any route) so OPTIONS preflight
// requests to /graphql are handled correctly by the browser.
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle OPTIONS preflight for all routes

// Parse JSON bodies globally
app.use(express.json());

// Multi-tenant Context Middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  let contextValue = { tenant_id: null, currentUser: null };

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_hrms_key_123');
      contextValue = { 
        tenant_id: decoded.tenant_id, 
        currentUser: decoded 
      };
    } catch (err) {
      console.warn('Invalid token provided');
    }
  }

  // If x-tenant-id header is provided (for dev/testing), override tenant_id
  if (req.headers['x-tenant-id']) {
    contextValue.tenant_id = req.headers['x-tenant-id'];
  }

  contextStore.run(contextValue, next);
});

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  // Build unified schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    introspection: true,
  });

  await server.start();

  // Apply Apollo middleware — CORS is already handled globally above
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Retrieve the current context that was set by the middleware
        const store = contextStore.getStore();
        return {
          tenant_id: store?.tenant_id,
          currentUser: store?.currentUser,
          req
        };
      },
    })
  );

  // Health check route
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = app.listen(PORT, () => {
    console.log(`🚀 HRMS GraphQL Server ready at http://localhost:${PORT}/graphql`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use.`);
      console.error(`   Run: netstat -ano | findstr :${PORT}  then  taskkill /PID <PID> /F\n`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => { httpServer.close(() => process.exit(0)); });
  process.on('SIGINT',  () => { httpServer.close(() => process.exit(0)); });
}

startServer().catch((err) => {
  console.error('💥 Failed to start server:', err);
  process.exit(1);
});
