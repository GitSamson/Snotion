const NTDB = require('./Notion_database');
const logPrex = '[Notion_Filter]  '
module.exports =  function filter(database, dict, condition) {
  // array: {title:test, run:false}
  let cond = Object.keys(dict).length > 1 ? condition ? condition : 'and' : false;
  let db = database;
  let db_props = db.props;
  var res = [];
  if(db_props == undefined){
    console.log(logPrex ,'database filter function failed, the database is empty')
    return;}
  for (key in dict) {
    if (db_props[key] != undefined && dict[key] != undefined) {
      res.push(filterCondition(key, db_props, dict));
    }
  }

  if (res.length != 0) {
    return cond ? {
        filter: {
          [cond]: res
        }
      }: {filter:
      res[0]}

  } else {
    console.warn('there is no input in the filter');
    return;
  }
};

function filterCondition(key, db_props, list) {
  let propType = db_props[key].type;
  let cond = propType == 'relation' ? 'contains' : 'equals'
  return {
    "property": key,
    [propType]: {
      [cond]: list[key]
    }
  }
}