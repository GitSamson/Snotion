// for single prop object:
const ut = require("../utilies.js");
const NT_page = require('./Notion_Page')

function NT_prop(data) {
    this.id = data.id;
    this.parent;
    this.name;
    this.raw_data = data;
    this.type = data.type;
    this.content = objectProperty.get_text(data);
    return this;
}
NT_prop.prototype.update = function (input) {
    if (this.content == input) {
        return;
    }
    this.content = input;
    return rs.page.update(
        this.parent.id, {
            properties: updateTextPackager(this, input)
        }
    );
};


NT_prop.prototype.create = function (input) {
    if (input == null) {
        return null
    };
    return updateTextPackager(this, input);
    /*
    "ID": {
        "title": [{
            "text": {
                "content": "new page test"
            }
        }]
        }
    */
}

objectProperty = {
    get_type: function (property) {
        if (property.object) {
            return this.property.object;
        }
        if (Array.isArray(property)) {
            throw 'input is an Array';
        }
        if (property.type) {
            return property.type;
        }
    },
    get_text: function (data) {

        let type = data.type;
        if (type == 'page' | 'list') {
            return data.id
        }
        let typeProp = data[type];
        return findTypeProp(typeProp, type)
    }
}

function findTypeProp(typeProp, type) {
    let res = typeProp;
    if (typeProp == null) {
        return null;
    }
 
    let map = {
        select: typeProp.name,
        title: typeProp.length > 0 ? typeProp[0].plain_text : null,
        checkbox: typeProp.checkbox,
        files: type == 'files'&& typeProp.length > 0 &&typeProp.map((i) => {
            return {
                name:i.name,
                url: i.external ? i.external.url : i.file.url,
            }
        }) 
    };
    if (map[type] != undefined) {
        res = map[type];
    }
    return type == 'files' ? res:flattenContent(res);

}

function flattenContent(content) {
    if (content == null) {
        return null;
    } else if (content.length >= 0) {
        return ut.flatten(content, 'plain_text', 'name', 'id', '');
    } else if (typeof (content) == 'boolean') {
        return content;
    } else {
        return null;
    }
}

var propContentRemapping = {
    relation: function (input) {
        return (
            [{
                id: input
            }]
        );
    },
    rich_text: function (input) {
        if (typeof (input) != 'string') {
            input = String(input);
        }
        return ([{
            text: {
                content: input
            }
        }]);
    },
    url: function (input) {
        return (input);
    },
    checkbox: function (input) {
        return input;
    },
    files: function (input) {
        if (input == undefined) {
            return;
        }
        input[0] != undefined && (input[0].name || input[0].external || input[0].external.url) ||
            console.warn('files request format error, example: ', {
                "Image": {
                    "files": [{
                        "name": "test1",
                        "external": {
                            "url": "https://2022notion-1306157187.cos.ap-shanghai.myqcloud.com/Notion_FFE/6a913626-0f75-40b2-b9a3-deadc316b259_CL07-CL08a_image2.jpeg"
                        }
                    }, {
                        "name": "test2",
                        "external": {
                            "url": "https://2022notion-1306157187.cos.ap-shanghai.myqcloud.com/Notion_FFE/6a913626-0f75-40b2-b9a3-deadc316b259_CL01-CL02_image12.png"
                        }
                    }]
                }
            });



        return input;
    },
    archived: function (input) {
        return input;
    }

};
propContentRemapping.phone_number = propContentRemapping.url;
propContentRemapping.email = propContentRemapping.url;
propContentRemapping.title = propContentRemapping.rich_text;


function updateTextPackager(prop, text) {
    let res = {};
    
    res[prop.name] = propContentRemapping[prop.type](text);
    return res;
    /*
    "ID": {
        "title": [{
            "text": {
                "content": "new page test"
            }
        }]
        }
    */

}

module.exports = NT_prop;