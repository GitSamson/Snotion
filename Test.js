require('dotenv').config({
    path: './.env'
});
const ntdb = require('./src/Notion_database');
const client = require('./index');

const ID = process.env;
const ndb_id = ID.database_id;
const token = ID.NOTION_TOKEN;

async function run() {

    var db_test = new client.init(token,ndb_id);
    var db = await db_test.query({page_size:2});
    console.log(db);
    

}

run();
console.log();