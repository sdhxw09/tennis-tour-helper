/**
 * Created with JetBrains WebStorm.
 * User: Hua Wu
 * Date: 11/26/12
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.
 */

var meboss = {
    refreshRanking: function(ageGroup, rankingPopupData) {
        var myDataTable = $('#currentRanking').dataTable();
        if (ageGroup == 'L') {
            myDataTable = $('#lowerGroupRranking').dataTable();
        }

        myDataTable.fnClearTable();
        myDataTable.fnAddData(rankingPopupData);
    },

    refreshApplicant: function(applicantPopupData) {
        var myDataTable = $('#applicant').dataTable();

        myDataTable.fnClearTable();
        myDataTable.fnAddData(applicantPopupData);
        $('#totalRecord').html(myDataTable.fnSettings().fnRecordsTotal());
    }
};

$(document).ready(function() {
    var rankingTableOpt = {
        "aoColumns": [
            { "sTitle": "Name" },
            { "sTitle": "Ranking" },
            { "sTitle": "State" }
        ],
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": false,
        "bInfo": false,
        "bAutoWidth": false
    };

    var applicantTableOpt = {
        "fnDrawCallback": function (oSettings) {
            /* Need to redo the counters if filtered or sorted */
            if ( oSettings.bSorted || oSettings.bFiltered ) {
                for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ ) {
                    $('td:eq(0)', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
                }
            }
        },
        "aoColumns": [
            { "sTitle": "" },
            { "sTitle": "Name" },
            { "sTitle": "B14" },
            { "sTitle": "B12" },
            { "sTitle": "State" }
        ],
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] }
        ],
        "aaSorting": [[2,'asc'], [3,'asc']],
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bInfo": false
    };

    $('#tabs').tabs();
    $(':button').button();

    var currentTable = $('#currentRanking').dataTable(rankingTableOpt);
    var currentData = JSON.parse(localStorage.getItem('C'));
    if (currentData) {
        currentTable.fnAddData(currentData);
    }

    var lowerTable = $('#lowerGroupRranking').dataTable(rankingTableOpt);
    var lowerData = JSON.parse(localStorage.getItem('L'));
    if (lowerData) {
        lowerTable.fnAddData(lowerData);
    }

    $('#applicant').dataTable(applicantTableOpt);

    $('#currentRankingButton').click(function(tab) {
        console.log('Refresh button on B14 clicked on tab ...');
        chrome.extension.getBackgroundPage().meboss.refreshCurrentRanking();
    });

    $('#lowerRankingButton').click(function(tab) {
        console.log('Refresh button on B12 clicked on tab ...');
        chrome.extension.getBackgroundPage().meboss.refreshLowerGroupRanking();
    });

    $('#applicantButton').click(function() {
        console.log('Set Ranking button clicked ...');
        chrome.extension.getBackgroundPage().meboss.setApplicantRanking();
    });
});
