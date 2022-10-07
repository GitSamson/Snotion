require('dotenv').config({
    path: './.env'
});

const client = require('./index');

const ID = process.env;
const ndb_id = ID.database_id;
const token = ID.NOTION_TOKEN;

function run() {

    const nt = client.init(token);
    
    nt.databases.query({
        database_id: ndb_id,
        page_size: 2
    }).then(data => {
        console.log(data.results[0].properties);
    })


}

run();