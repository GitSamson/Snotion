function array_filter(array, name) {
    let rst = [];
    for (i in array) {
        rst.push(array[i][name]);
    }
    return rst;
}

function flip(object) {
    // [{},{},{}] => {XX:[],XX:[],XX:[]}
    if (Array.isArray(object)) {
        let rst = {};
        //find keys:
        for (item in object) {
            let current_item = object[item];
            for (key in current_item) {
                let current_value = current_item[key];
                if (rst[key]) {
                    rst[key].push(current_value);
                } else {
                    rst[key] = [current_value];
                }
            }
        }
        return rst;
    }
    // {XX:[],XX:[],XX:[]} => [{X1:1,X2:2,X3:3},{},{}]
    else {
        let rst = [];
        for (key in object) {
            let current_valArray = object[key];
            for (item in current_valArray) {
                let current_val = current_valArray[item];
                if (!rst[item]) {
                    rst[item] = {}
                };
                rst[item][key] = current_val;
            }
        }
        return rst;
    }
}

function longest(array){
    let res = array;
    let maxLength = 0;
    if (Array.isArray(res) == false) {
        console.warn('longest input is not array, return itself');
        return res
    }else{
        if (Array.isArray(res[0]) == false) {
            console.warn('longest item of input is not array, return itself');
            return res;
        }
    }
    res.forEach(element => {
        maxLength = element.length > maxLength ? element.length : maxLength;
    });
    res.forEach(j =>{
        while (j.length < maxLength) {
            j.push(j[j.length-1]);
        }
    })
    return res
}
function flatten(input) {
    if (input == false || input == null || input == undefined) {
        // if empty
        return null;
    } else if (input instanceof Array) {
        // if Array
        let result = [];
        for (i in input) {
            result.push(flatten(input[i]));
        }
        if(result.length ==1 ){
            result = result[0];
        }
        return result;
    } else if (input instanceof Object) {
        return 'plain_text' in input      ? input.plain_text :
        'file' in input                   ? input.file.url : 
        Object.keys(input).length == 1  ? input[Object.keys(input)[0]] :
        JSON.stringify(input)
    } else {
        // if text 
        return input;
    }
}


function webRealAddress(text) {
    let tx = text;
    if (tx==false || tx == null) {
        return false;
    }
    tx = tx.split('//');
    tx = tx.length == 1 ? tx[0] : tx[1];
    console.log(tx);
    let rst = tx.split('.');
    console.log(rst);
    return rst.length >= 3 ? rst[1] : rst[0];
}
function emailRealAddress(text){
    let tx = text;
    if (tx==false || tx == null || tx == undefined) {
        return false;
    }
    tx = tx.split('@')[1].split('.')[1];
    if(tx == '163' || tx == '162' || tx == 'qq' || tx== 126){return false;}
    return tx;

}
function find(value,database, propertyName ) {
    if(value == null || value == undefined|| value == false){
        return undefined;
    }
    if(value instanceof Object){
        for (j in value){
            let currentResult = find(value[j], database, j);
            if(currentResult != undefined){
                return currentResult;
            }
        }
    }
    else {
        for (y in database) {
            let current_item = database[y][propertyName];
            if (current_item == value) {
                return database[y].id;
            }
        }
    }
    return undefined;
}

function intToColumnIndex(int){

return  String.fromCharCode(int+65)

}
exports.flip = flip;
exports.flatten = flatten;
exports.webRealAddress = webRealAddress;
exports.find = find;
exports.emailRealAddress= emailRealAddress;
exports.intToColumnIndex = intToColumnIndex;
exports.longest = longest;