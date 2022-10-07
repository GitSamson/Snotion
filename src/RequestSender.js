var request = require('request');
const Key = process.env.NotionKey;


if (Key==undefined){console.error("Key is required");;}

var url = function (id, type, command) {
    var result = 'https://api.notion.com/v1/' + type + '/' + id;
    if (command) {
        result = result + '/' + command;
    }
    return result;
};

var header = {
    'Authorization': "Bearer " + Key,
    "Notion-Version": "2021-08-16",
    "Content-Type": "application/json"
};


function send(method = 'POST', type, id, command = false, data = false) {
    try {
        var options = {
            url: url(id, type, command),
            headers: header,
            method: method,
            timeout: 20000
        }
        // console.log(options.url);
        if (data != false) {
            options.body = JSON.stringify(data);
        }
        // console.log(options);
        return new Promise(function (res, rej) {
            request(options, function (error, response, body) {
                if (!error) {
                    // console.log('request sent','statusCode: ', response.statusCode);
                    response.statusCode != 200 &&
                        console.log('repsponse from request sender need attention : ', (body));
                    response.statusCode != 200 &&
                        console.log('Sent in Payload : ', options.body);
                    res(JSON.parse(body));
                } else {
                    console.error(error.code);
                }
            });
        });
        
    } catch (error) {
        throw error;
    }
        
    }
    

exports.database = {
    retrieve: function (id) {
        return send('GET', 'databases', id, false, false);
    },
    query: function (id, data = false) {
        return send('POST', 'databases', id, 'query', data);
    },
    list: 'to be update',
    create: 'to be update'
};
exports.page = {
    retrieve: function (id) {
        return send('GET', 'pages', id, false, false);
    },
    create: function (data) {
        return send('POST', 'pages', '', false, data);
    },
    update: function (id, data = false) {
        //console.log('page updating');
        return send('PATCH', 'pages', id, false, data);
    }
};