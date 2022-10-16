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
    this.parameter = parameter;
    this.parameter.database_id =  this.ntdb_id;

    return ntdb.database(this.client.databse.query(this.parameter));
  }
}


const notionPort = {
  init : s_nt_db_init,
}

// require('dotenv').config();


module.exports = notionPort;