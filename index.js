const ntdb = require('./src/Notion_database')
const {
  Client
} = require('@notionhq/client')


class s_nt_db_init{
  constructor(secret,ntdb_id){
    this.secret_key = secret;
    this.ntdb_id = ntdb_id;
    this.client = new Client({
      auth: secret,
    });
  }
  query(parameter){
    this.payload = parameter;
    this.payload['database_id'] =  this.ntdb_id;
    return this.client.databases.query(this.payload).then(
      data=>{
        return ntdb.database(data)
      }
    );
  }
}


const notionPort = {
  init : s_nt_db_init,
}

// require('dotenv').config();


module.exports = notionPort;