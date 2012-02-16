chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var option = request.option;
    console.log('content script gets request ' + option);

    if (option === "RANKING") {
        var data = {};
        var trElements = document.all.tags('tbody')[1].childNodes;
        for (var i = 1; i < 501; i++) {
            var ranking = trElements[i].firstElementChild.firstElementChild.firstChild.nodeValue;
            var name = trElements[i].firstElementChild.nextSibling.firstElementChild.firstChild.nodeValue;
            var state = trElements[i].firstElementChild.nextSibling.nextSibling.nextSibling.firstElementChild.firstChild.nodeValue;

            var personalInfo = [ranking, state];
            data[name.trim()] = personalInfo;
        }

        chrome.extension.sendRequest({'option': option, 'data': data});
    }
    else {
        var data = [];
        var aElements = $('#applicants a.cboxElement').each(function() {
            var name = this.text;
            data.push(name.trim());
        });

        chrome.extension.sendRequest({'option': option, 'data': data});
    }
});

