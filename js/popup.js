/**
 * Created with JetBrains WebStorm.
 * User: Hua Wu
 * Date: 11/26/12
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.
 */

var meboss = {
    refreshRanking: function(rankingPopupData) {
        var myDataTable = $('#ranking').dataTable();
        myDataTable.fnClearTable();
        if (rankingPopupData) {
            myDataTable.fnAddData(rankingPopupData);
        }
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
            { "sTitle": "B18" },
            { "sTitle": "B16" },
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

    var rankingTable = $('#ranking').dataTable(rankingTableOpt);
    var currentData = JSON.parse(localStorage.getItem('NC_CURRENT'));
    if (currentData) {
        rankingTable.fnAddData(currentData);
    }

    $('#applicant').dataTable(applicantTableOpt);

    $('#rankingButton').click(function(tab) {
        var ageGroup = $('#ageGroup').val();
        chrome.extension.getBackgroundPage().meboss.refreshCurrentRanking(ageGroup);
        return false;
    });

    $('#applicantButton').click(function() {
        var section = $('#section').val();
        chrome.extension.getBackgroundPage().meboss.setApplicantRanking(section);
        return false;
    });

    $('#ageGroup').change(function() {
        var ageGroup = $('#ageGroup').val();
        console.log(ageGroup + " selected.");

        var rankingData = JSON.parse(localStorage.getItem(ageGroup));
        meboss.refreshRanking(rankingData);
    });

});
