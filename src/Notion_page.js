const rs = require('../RequestSender');
const NT_prop = require('./Notion_Property');
const logPrex = '[Notion_Page]';

// for single page object in the database. 
function NT_Page(RAW_page_data) {
    // input type checker
    this.id = RAW_page_data.id;
    if (RAW_page_data.object != 'page') {
        throw (logPrex, 'NT_page fail, input is not a page object', RAW_page_data);
    }
    this.simplifiedData = {};
    this.props = {};
    for (const prop in RAW_page_data.properties) {
        this.props[prop] = new NT_prop(RAW_page_data.properties[prop]);
        this.props[prop].parent = this;
        this.props[prop].name = prop;
        this[prop] = this.props[prop].content;
        this.simplifiedData[prop] = this.props[prop].content;

    }
    return this;
}
NT_Page.prototype.update = function (updatesPackage) {
    for (i in updatesPackage) {
        this.props[i] ?
            this.props[i].update(updatesPackage[i]) :
            console.warn(logPrex, `page update failed, the property ${propertyName} does not exist`);

    }
};

NT_Page.prototype.findPropID = function (propName) {
    if (this.props.propName != undefined) {
        return this.props.propName.id;
    };
}
NT_Page.prototype.delete = function () {
    rs.page.update(this.id, {
        "archived": true
    })
    //this.props.archived.update(true);
}

// Check this page whether is the matching data, data format: {Title:test, Run:true}
NT_Page.prototype.find = function (data) {
    for (i in data) {
        if (this.props[i] == undefined) {
            return false
        };
        if (this.props[i].content != data[i]) {
            return false;
        }
    }
    return true;
}

NT_Page.prototype.create = function (object) {
    // input : {'ID':123, "Color":"Red", ...}
    let result = {
        properties: {}
    };
    for (const i in object) {
        if (Object.hasOwnProperty.call(object, i)) {
            const element = object[i];
            if (this.props[i] == undefined) {
                console.log(logPrex, 'found failed created item: ', i);
                continue;

            } else {
                if (element != null && this.props[i] != undefined);
                Object.assign(result.properties, this.props[i].create(element));
                // Combine object properties, will also change operator, no need to reassign.   
            }

        }
    }
    return result;
}

NT_Page.prototype.get_property = function () {
    let result = {};
    let arg = arguments.length == 1 ? arguments[0] : arguments;

    for (let j in arg) {
        let current_argument = arg[j];
        if (this[current_argument] != undefined) {
            result[current_argument] = this[current_argument];
        } else {
            // console.log('dont have this property in database  ' + current_argument);
            result[current_argument] = '';
        }
    }
    return result;
};

exports.NT_Page = NT_Page;