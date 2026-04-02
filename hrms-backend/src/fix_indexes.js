import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

await connectDB();

const fixIndexes = async () => {
  console.log('🧹 Cleaning up old global indexes...');

  const collections = ['employees', 'departments', 'leavebalances', 'leavetypes'];
  
  for (const colName of collections) {
    try {
      const collection = mongoose.connection.db.collection(colName);
      const indexes = await collection.indexes();
      console.log(`Checking indexes for ${colName}...`);

      for (const idx of indexes) {
        // Drop unique indexes that are not compound with tenant_id
        if (idx.unique && !idx.key.tenant_id && idx.name !== '_id_') {
          console.log(`  🗑️ Dropping old unique index: ${idx.name}`);
          await collection.dropIndex(idx.name);
        }
      }
    } catch (err) {
      console.warn(`  ⚠️ Could not process collection ${colName}: ${err.message}`);
    }
  }

  console.log('\n✅ Old indexes cleaned. Models will now recreate tenant-scoped indexes.');
  process.exit(0);
};

fixIndexes().catch(err => {
  console.error('❌ Failed to fix indexes:', err);
  process.exit(1);
});
