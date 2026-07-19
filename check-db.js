const { MongoClient } = require('mongodb');
const uri = 'mongodb://medimind:9ZJXwN6BWfesAdLT@ac-u3ij9dn-shard-00-00.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-01.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-02.h1jjxd4.mongodb.net:27017/?ssl=true&replicaSet=atlas-1gfzii-shard-0&authSource=admin&appName=Cluster0';
const client = new MongoClient(uri);
client.connect().then(async () => {
  const dbs = await client.db().admin().listDatabases();
  console.log('Databases:', dbs.databases.map(d => d.name));
  const db = client.db('Medimind');
  const collections = await db.listCollections().toArray();
  console.log('Medimind collections:', collections.map(c => c.name));
  const users = await db.collection('user').find({}).toArray();
  console.log('users in user collection:', users.length);
  users.forEach(u => console.log(' -', u.email, '| role:', u.role));
  try {
    const users2 = await db.collection('users').find({}).toArray();
    console.log('users in users collection:', users2.length);
    users2.forEach(u => console.log(' -', u.email, '| role:', u.role));
  } catch(e) { console.log('No users collection or error:', e.message); }
  await client.close();
  process.exit(0);
}).catch(e => { console.error('Connection error:', e.message); process.exit(1); });
