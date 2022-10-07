const op = require("./notion_connector/Notion_Page.js");
const rs = require("./RequestSender.js");
const filter = require('./notion_connector/Notion_Filter.js');
const logPrex = '[database]';
const ctrl = require('./Ctrl.json');

function database(JSON) {
  // if JSON has two arguements, initialize with id and pages
  if (arguments.length == 2) {
    if (arguments[1].page_size) {
      return rs.database.query(arguments[0], arguments[1]).then(
        data => {
          return new database(data);
        }
      );
    } else {
      return rs.database.query(arguments[0], {
        page_size: 0
      }).then(
        data => {
          let filterData = filter(new database(data), arguments[1]);
          return rs.database.query(arguments[0], filterData).then(
            sec_data => {
              return new database(sec_data);
            }
          )
        }
      );


    }
  }

  if (typeof JSON == "string") {
    return rs.database.query(JSON).then(
      data => {
        return new database(data);
      }
    );
  } else {
    if (JSON == undefined) {
      throw (logPrex, 'undefined input of database, initialize failed');
    }

    this.items = JSON.results; //Array
    this.pages = [];
    this.next_cursor = JSON.next_cursor;
    this.has_more = JSON.has_more;
    this.raw = JSON;
    if (this.items.length != 0) {
      this.id = this.items[0].parent.database_id;
      for (const key in this.items) {
        const element = this.items[key];
        // console.log(new op.NT_Page(element));
        let tobePushedData = new op.NT_Page(element);
        this.pages.push(tobePushedData);
      }
      // in default, props will be the first page.
      this.props = this.pages[0].props;
      //console.log('database initialized',this)
    }
    return this;
  }
}

// find a page with property, data format: {Title:test, Run:true}
// return an array including all matching nt pages
database.prototype.find = function (data) {
  let res = [];
  this.pages.map(ntPage => {
    ntPage.find(data) && res.push(ntPage);
  });

  return res.length == 0 ? false : res;
};

//get property text from object
database.prototype.get_property = function (name) {
  let result = [];
  for (i in this.pages) {
    let curPage = this.pages[i];
    result.push(curPage.get_property(arguments));
  }
  return result;
}


// get all properties text from single page
database.prototype.get_properties = function (list) {
  let res = {};
  for (i in arguments) {
    res.push(this.get_property(arguments[i]));
  }
  return res;
};
database.prototype.simplifyData = function () {
  let res = [];
  for (i in this.pages) {
    let curPage = this.pages[i];
    res.push(curPage.simplifiedData);
  }
  return res;
};
database.prototype.newPage = function (object) {
  // input : {'ID':123, "Color":"Red", ...}
  let res = this.pages[0].create(object);
  res.parent = {
    database_id: this.id
  };

  ctrl.createPage ?
    rs.page.create(res).then((data) => {
      console.log(logPrex, 'page created', data.url);
    }) : console.log(logPrex, 'page create request stoped by global control', res)
};
database.prototype.query = function (payload) {
  //console.log('query from database');
  if (payload != undefined) {
    //console.log(this.id, payload);
    return rs.database.query(this.id, payload).then(
      data => {
        return data;
      }
    )
  } else {
    return rs.database.query(this.id).then(
      data => {
        //console.log(data);
        return data;
      }
    )
  }
}
database.prototype.query_filter = function (filterDict) {
  if (filterDict == undefined) {
    console.warn(logPrex, 'Query_filter function need a filter Dict parameter, format: {title:test, Run:true}');
    return;
  } else {
    return this.query(filter(this, filterDict, 'and'));
  }
}
database.prototype.removeAll = function () {
  console.log(logPrex, `${this.pages.length} are removing...`);
  (this.pages.length >= 0) && this.pages.map((ntPage) => {
    ntPage.delete();
  });

}
exports.database = database;