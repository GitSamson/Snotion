require('dotenv').config({
    path: './.env'
});
const ntdb = require('./src/Notion_database');
const client = require('./index');

const ID = process.env;
const ndb_id = ID.database_id;
const token = ID.NOTION_TOKEN;

function run() {

    var db_test = new client.init(token,ndb_id);
    console.log(db_test.query(
        {page_size:2}
    ));
    
    // nt.databases.query({
    //     database_id: ndb_id,
    //     page_size: 2
    // }).then(data => {
    //     ntdb.database(data);
    //     console.log(data.results[0].properties);
    // })


}

run();