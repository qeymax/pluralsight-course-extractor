var fs = require("fs");
var phantom = require('phantom');
var prompt = require('prompt');
var stat = "Failed";
prompt.start();
console.log("PLEASE MAKE SURE BOTH FOLDERS 'INPUT' AND 'OUTPUT' ARE EMPTY BEFORE YOU COPY FILES INTO THE 'INPUT' FOLDER");
console.log("Enter Course's main page url :-");
prompt.get(["url"], function(err, result) {
    var sitepage = null;
    var phInstance = null;
    var me = null;
    var list = {};
    if (result == null) {
        result = {};
        result.url = "error";
    }
    phantom.create()
        .then(instance => {
            phInstance = instance;
            return instance.createPage();
        })
        .then(page => {
            sitepage = page;
            console.log("Fetching information...");
            return page.open(result.url);
        })
        .then(status => {
            me = sitepage.evaluate(function() {
                var test = document.getElementsByClassName("course-hero__title")[0];
                var myList = {
                    title: "",
                    dic: {}
                };

                if (test == null) {
                    var title = document.getElementsByClassName("title")[0].getElementsByTagName("h2")[0].innerText;
                    myList.title = title;
                    var container = document.getElementById("tab-toc__accordion");
                    var headersContainers = container.getElementsByClassName("accordion-title");
                    var listsContainers = container.getElementsByClassName("accordion-content");
                    for (var i = 0; i < headersContainers.length; i++) {
                        var header_text = headersContainers[i].getElementsByClassName("accordion-title__title")[0].innerText;
                        myList.dic["" + header_text + ""] = [];
                        var list = listsContainers[i].getElementsByClassName("accordion-content__row__title");
                        for (var y = 0; y < list.length; y++) {
                            myList.dic["" + header_text + ""].push(list[y].innerText);
                        }
                    }
                } else {
                    var title = document.getElementsByClassName("course-hero__title")[0].innerText;
                    myList.title = title;
                    var containers = document.getElementsByClassName("accordian__section");
                    for (var i = 0; i < containers.length; i++) {
                        var header_text = containers[i].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].innerText;
                        myList.dic["" + header_text + ""] = [];
                        var cList = containers[i].getElementsByClassName("table-of-contents__clip-list-title");
                        for (var y = 0; y < list.length; y++) {
                            myList.dic["" + header_text + ""].push(cList[y].innerText);
                        }
                    }
                }

                str = JSON.stringify(myList);

                return str;
            });
            return sitepage.property('content');
        })
        .then(content => {
            obj = Promise.resolve(me);

            obj.then(function(object) {
                if (object == null) {
                    console.log("Failed to fetch information, please check url");
                } else {
                    console.log("fetched Information.");
                    stat = "All Done";
                }
                var temp = JSON.parse(object);
                list = temp.dic;
                var cTitle = temp.title.replace(/[<>:"\/\\|?*]+/g, '');
                var number = 0;
                for (var key in list) {
                    number += list[key].length;
                }



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


                var files = fs.readdirSync(__dirname + "/Input");
                files.sort(sortAlphaNum);
                folders = files;
                if (number != folders.length) {
                    console.log("Number of videos (" + number + ") doesn't match the number of files (" + folders.length + ") in the 'Input' folder");
                    console.log("Aborted.");
                } else {

                    console.log("Working on files...");
                    fs.mkdirSync(__dirname + "/Output/" + cTitle);
                    for (var key in list) {
                        if (list.hasOwnProperty(key)) {
                            if (folderCount.toString().length == 1) {
                                strFolderCount = "0" + folderCount;
                            } else {
                                strFolderCount = folderCount;
                            }
                            fileCount = 1;
                            fs.mkdirSync(__dirname + "/Output/" + cTitle + "/" + strFolderCount + " - " + key);
                            for (var i = 0; i < list[key].length; i++) {
                                if (fileCount.toString().length == 1) {
                                    strCount = "0" + fileCount;
                                } else {
                                    strCount = fileCount;
                                }
                                var name = list[key][i].replace(/[<>:"\/\\|?*]+/g, '');
                                var file = fs.readdirSync(__dirname + "/Input/" + folders[count]);
                                fs.renameSync(__dirname + "/Input/" + folders[count] + "/" + file[0], __dirname + "/Output/" + cTitle + "/" + strFolderCount + " - " + key + "/" + strCount + " - " + name + ".mp4");
                                count++;
                                fileCount++;
                            }
                        }
                        folderCount++;
                    }

                    console.log(stat);
                }
            }, function(e) {
                // not called
            });
            sitepage.close();
            phInstance.exit();
        })
        .catch(error => {
            console.log(error);
            phInstance.exit();
        });

});
