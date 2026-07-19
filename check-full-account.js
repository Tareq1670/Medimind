const { MongoClient } = require('mongodb');
const uri = 'mongodb://medimind:9ZJXwN6BWfesAdLT@ac-u3ij9dn-shard-00-00.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-01.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-02.h1jjxd4.mongodb.net:27017/?ssl=true&replicaSet=atlas-1gfzii-shard-0&authSource=admin&appName=Cluster0';
const client = new MongoClient(uri);
client.connect().then(async () => {
  const db = client.db('Medimind');
  const accounts = await db.collection('account').find({}).toArray();
  for (const a of accounts) {
    console.log('=== Account ===');
    for (const [k, v] of Object.entries(a)) {
      if (k === '_id') console.log(`  _id: ${v}`);
      else if (k === 'userId') console.log(`  userId: ${v} (type: ${typeof v})`);
      else if (k === 'password') console.log(`  password: ${v.substring(0,30)}...`);
      else console.log(`  ${k}: ${JSON.stringify(v)}`);
    }
  }
  await client.close();
  process.exit(0);
}).catch(e => { console.error('Error:', e.message); process.exit(1); });
