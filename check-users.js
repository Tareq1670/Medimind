const { MongoClient } = require('mongodb');
const uri = 'mongodb://medimind:9ZJXwN6BWfesAdLT@ac-u3ij9dn-shard-00-00.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-01.h1jjxd4.mongodb.net:27017,ac-u3ij9dn-shard-00-02.h1jjxd4.mongodb.net:27017/?ssl=true&replicaSet=atlas-1gfzii-shard-0&authSource=admin&appName=Cluster0';
const client = new MongoClient(uri);
client.connect().then(async () => {
  const db = client.db('Medimind');
  const users = await db.collection('user').find({}).sort({ email: 1 }).toArray();
  for (const u of users) {
    console.log('=== User:', u.email, '===');
    console.log('  _id:', u._id);
    console.log('  role:', u.role);
    console.log('  has password:', !!u.password);
    console.log('  password length:', u.password ? u.password.length : 'N/A');
    if (u.password) {
      console.log('  password prefix:', u.password.substring(0, 20));
      console.log('  password algo:', u.password.startsWith('$2') ? 'bcrypt' : u.password.startsWith('$argon') ? 'argon2' : 'unknown');
    }
    console.log('  keys:', Object.keys(u));
  }
  await client.close();
  process.exit(0);
}).catch(e => { console.error('Error:', e.message); process.exit(1); });
