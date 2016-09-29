var fs = require("fs");
var list = JSON.parse(fs.readFileSync(__dirname + '/list.JSON', 'utf8'));
var folders = [];
var count = 0;
var fileCount = 1;
var folderCount = 1;
var strCount;
var strFolderCount;

var reA = /[^a-zA-Z]/g;
var reN = /[^0-9]/g;

function sortAlphaNum(a, b) {
    var aA = a.replace(reA, "");
    var bA = b.replace(reA, "");
    if (aA === bA) {
        var aN = parseInt(a.replace(reN, ""), 10);
        var bN = parseInt(b.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
}


fs.readdir(__dirname + "/Input", function(err, files) {
    files.sort(sortAlphaNum);
    folders = files;
    for (var key in list) {
        if (list.hasOwnProperty(key)) {
            if (folderCount.toString().length == 1) {
                strFolderCount = "0" + folderCount;
            } else {
                strFolderCount = folderCount;
            }
            fileCount = 1;
            fs.mkdirSync(__dirname + "/Output/" + strFolderCount + " - " + key);
            for (var i = 0; i < list[key].length; i++) {
                if (fileCount.toString().length == 1) {
                    strCount = "0" + fileCount;
                } else {
                    strCount = fileCount;
                }
                var name = list[key][i].replace(/[<>:"\/\\|?*]+/g, '');
                var file = fs.readdirSync(__dirname + "/Input/" + folders[count]);
                fs.renameSync(__dirname + "/Input/" + folders[count] + "/" + file[0], __dirname + "/Output/" + strFolderCount + " - " + key + "/" + strCount + " - " + name + ".mp4");
                count++;
                fileCount++;
            }
        }
        folderCount++;
    }
});

console.log("Done");
