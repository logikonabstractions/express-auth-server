const sqlite3 = require('sqlite3').verbose()
var mkdirp = require('mkdirp');
var crypto = require('crypto');
mkdirp.sync('./var/db');
// var db = new sqlite3.Database('./var/db/todos.db');
var db = new sqlite3.Database('./var/db/users.db');

db.serialize( function (){
//  create db schema for user table
    db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    name TEXT, \
    email TEXT UNIQUE, \
    email_verified INTEGER \
  )");
    db.run("CREATE TABLE IF NOT EXISTS federated_credentials ( \
    id INTEGER PRIMARY KEY, \
    user_id INTEGER NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    UNIQUE (provider, subject) \
  )");
    var salt = crypto.randomBytes(16);
    db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
        'alice',
        crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
        salt
    ]);
});

module.exports = db;
