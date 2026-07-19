const { MongoClient } = require('mongodb');
const uri = 'mongodb://medimind:9ZJXwN6BWfesAdLT@ac-u3ij9dn-shard-00-00.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-01.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-02.h1jjxd4.mongodb.net:27017/?ssl=true&replicaSet=atlas-1gfzii-shard-0&authSource=admin&appName=Cluster0';
const client = new MongoClient(uri);
client.connect().then(async () => {
  const db = client.db('Medimind');
  const accounts = await db.collection('account').find({}).toArray();
  console.log('Total accounts:', accounts.length);
  for (const a of accounts) {
    console.log('=== Account ===');
    console.log('  providerId:', a.providerId);
    console.log('  accountId:', a.accountId);
    console.log('  userId:', a.userId);
    console.log('  has password:', !!a.password);
    if (a.password) console.log('  password length:', a.password.length, '| prefix:', a.password.substring(0,25));
    console.log('  keys:', Object.keys(a));
  }
  await client.close();
  process.exit(0);
}).catch(e => { console.error('Error:', e.message); process.exit(1); });
