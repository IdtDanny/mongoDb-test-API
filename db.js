const {MongoClient} = require('mongodb'); // Driver downloaded and installed

let dbConnection

let uri_local = "mongodb://localhost:27017/bookStore"

let uri_global = "mongodb+srv://idtbusy:test@123@blog-lernen.e27kv3u.mongodb.net/"

module.exports = {

    // connect to db
    connectToDb: (cb) => {
        MongoClient.connect(uri_local)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })

        .catch(err => {
            console.log(err)
            return cb(err) // cb: callback function
        })
    },
    
    // Return the db connection
    getDb: () => dbConnection
}