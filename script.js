var list = document.getElementsByTagName("section");
var counter = 0;
var myList = {};
for (var i = 0; i < list.length; i++) {
    if (list[i].className.match(/\bmodule\b/)) {
        var header_text = list[i].getElementsByTagName("h2")[0].innerText;
        var ul = list[i].getElementsByClassName('clips');
        var li_list = ul[0].getElementsByClassName('title');
        if (li_list.length > 1) {
            myList["" + header_text + ""] = [];
            for (var y = 0; y < li_list.length; y++) {
                counter += 1;
                myList["" + header_text + ""].push(li_list[y].innerText);
            }

        }
    }
}
str = JSON.stringify(myList);
console.log(str);
