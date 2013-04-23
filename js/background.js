var meboss = {
    currentTabId: 0,
    ageGroup: 'NC_CURRENT',
    section: 'NC',

    addMessageListener: function() {
        chrome.tabs.onSelectionChanged.addListener(function (tabId) {
            meboss.currentTabId = tabId;
            chrome.tabs.get(tabId, function(tab) {
                var tabUrl = tab.url;
                console.log(tabUrl);
                if (tabUrl.indexOf('tennislink.usta.com/') != -1) {
                    chrome.pageAction.show(meboss.currentTabId);
                }
            });
        });

        chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
            var option = request.option;
            console.log('background script gets message on ' + option);

            if (option === "RANKING") {
                var playerData = request.data;

                var rankingPopupData = [];
                var names = Object.keys(playerData);
                for (var i = 0; i < names.length; i++) {
                    var name = names[i];
                    var myRanking = [name, playerData[name][0], playerData[name][1]];   //[name, ranking, state]
                    rankingPopupData.push(myRanking);
                }

                meboss.saveRanking(meboss.ageGroup, rankingPopupData);
                chrome.extension.getViews({type: 'popup'})[0].meboss.refreshRanking(rankingPopupData);
            }
            else {
                var currentAgeGroupName = 'NC_CURRENT';
                var lowerAgeGroupName = 'NC_LOWER';
                if (meboss.section == 'STA') {
                    currentAgeGroupName = 'STA_CURRENT';
                    lowerAgeGroupName = 'STA_LOWER';
                }

                var applicantData = request.data;
                var names = Object.keys(applicantData);
                var  applicantPopupData = [];
                for (var i = 0; i < names.length; i++) {
                    var name = names[i];

                    var currentRanking = '999';
                    var lowerGroupRanking = '';
                    var state = '';
                    var currentInfo = meboss.findRanking(currentAgeGroupName, name);
                    if (currentInfo.length != 0) {
                        currentRanking = currentInfo[0];
                        state = currentInfo[1];
                    }

                    var lowerGroupInfo = meboss.findRanking(lowerAgeGroupName, name);
                    if (lowerGroupInfo.length != 0) {
                        lowerGroupRanking = lowerGroupInfo[0];
                        if (!state) {
                            state = lowerGroupInfo[1];
                        }
                    }

                    applicantPopupData.push([i+1, name, currentRanking, lowerGroupRanking, state]);
                }

                chrome.extension.getViews({type: 'popup'})[0].meboss.refreshApplicant(applicantPopupData);
            }
        });
    },

    refreshCurrentRanking: function(ageGroup) {
        console.log('Refresh button on age group ' + ageGroup + ' clicked ...');
        meboss.ageGroup = ageGroup;
        chrome.tabs.sendMessage(meboss.currentTabId, {'option': 'RANKING'});
    },

    setApplicantRanking: function(section) {
        console.log('Set Ranking button clicked ...');
        meboss.section = section;
        chrome.tabs.sendMessage(meboss.currentTabId, {'option': 'APPLICANT'});
    },

    saveRanking: function(ageGroup, rankingPopupData) {
        localStorage.setItem(ageGroup, JSON.stringify(rankingPopupData));
        localStorage.setItem('TIMESTAMP', Date.now());
    },

    findRanking: function(ageGroup, name) {
        var ranking = [];
        var playerData = JSON.parse(localStorage.getItem(ageGroup));
        if (playerData) {
            for (var i = 0; i < playerData.length; i++) {
                var playerName = playerData[i][0];
                if (playerName.indexOf(name) != -1) {
                    ranking = [playerData[i][1], playerData[i][2]];
                    break;
                }
            }
        }

        return ranking;
    }
};

meboss.addMessageListener();
