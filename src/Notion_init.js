// require('dotenv').config();

const {
    Client
} = require('@notionhq/client')



module.exports = function run(id) {
    console.log(id);
    if (id == undefined) {
        console.warn('no id input');
        return;
    } else {
        return new Client({
            auth: id,
        });
    }
}