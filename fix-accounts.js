const { MongoClient } = require('mongodb');
const uri = 'mongodb://medimind:9ZJXwN6BWfesAdLT@ac-u3ij9dn-shard-00-00.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-01.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-02.h1jjxd4.mongodb.net:27017/?ssl=true&replicaSet=atlas-1gfzii-shard-0&authSource=admin&appName=Cluster0';
const client = new MongoClient(uri);
client.connect().then(async () => {
  const db = client.db('Medimind');
  
  // Fix providerId from 'email' to 'credential'
  const result = await db.collection('account').updateMany(
    { providerId: 'email' },
    { $set: { providerId: 'credential' } }
  );
  console.log('Fixed', result.modifiedCount, 'accounts (email -> credential)');
  
  // Verify
  const accounts = await db.collection('account').find({ providerId: 'credential' }).toArray();
  console.log('Credential accounts:', accounts.length);
  accounts.forEach(a => console.log(' -', a.accountId, '| userId:', a.userId.toString()));
  
  await client.close();
  process.exit(0);
}).catch(e => { console.error('Error:', e.message); process.exit(1); });
