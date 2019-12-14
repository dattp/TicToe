const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const path = require('path')

let connect = async (todoApp) => {
    const mongod = new MongoMemoryServer({
        instance: {
            port: 27017,
            dbName: todoApp || 'tictoe',
            dbPath: path.join(__dirname, '')
        }
    });
    const uri = await mongod.getConnectionString();
    const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();

    console.log('=====>', uri);
    console.log('=====>dbPath', dbPath);
    console.log('=====>port', port);

    mongod.getInstanceInfo();
    // mongod.getInstanceInfo();
    return uri
}

module.exports = connect