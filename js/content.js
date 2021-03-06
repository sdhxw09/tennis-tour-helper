chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var option = request.option;
    console.log('content script gets message on ' + option);

    if (option === "RANKING") {
        var data = {};

        var numOfPlayers = document.getElementById('grdMain').getElementsByTagName('tbody')[0].childNodes.length - 1;
        if (numOfPlayers > 800) {
            numOfPlayers = 801;
        }

        var trElements = document.getElementById('grdMain').getElementsByTagName('tbody')[0].childNodes;
        for (var i = 1; i < numOfPlayers; i++) {
            if (typeof(trElements[i]) != 'undefined') {
                var ranking = trElements[i].firstElementChild.firstElementChild.firstChild.nodeValue;
                var name = trElements[i].firstElementChild.nextSibling.firstElementChild.firstChild.nodeValue;
                var state = trElements[i].firstElementChild.nextSibling.nextSibling.nextSibling.firstElementChild.firstChild.nodeValue;

                var personalInfo = [ranking, state];
                data[name.trim()] = personalInfo;
            }
        }

        chrome.extension.sendMessage({'option': option, 'data': data});
    }
    else {
        var data = {};
        var aElements = $('#applicants a.cboxElement');
        if (aElements.length == 0) {
            aElements = $('#competitors a');
        }

        aElements.each(function() {
            if ($(this).attr('href') !== '#top') {
                var name = this.text.trim();
                if (!data[name]) {
                    data[name] = true;
                }
            }
        });

        chrome.extension.sendMessage({'option': option, 'data': data});
    }
});

