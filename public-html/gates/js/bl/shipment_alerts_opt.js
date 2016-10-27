function initializeAlertDialogs() {

    $("#kickerTemplatesDivDialog").dialog({
        title: 'Alert Email Templates',
        autoOpen: false,
        autoResize: true,
        minHeight: 0,
        modal: true,
        width: 850,
        buttons: [{
            text: "Exit",
            click: function () {
                $(this).dialog("close");
            }
        }, {
            text: "Send",
            click: function () {
                var myGrid = $('#sendKickerGrid');
                var selRowId = myGrid.jqGrid('getGridParam', 'selrow');
                if (null == selRowId) {
                    alert('Please select a template');
                    return;
                }
                var templateId = myGrid.jqGrid('getCell', selRowId, 'templateId');
                applyAndSendKicker(templateId);
            }
        }]
    });

    $("#sendKickerDivDialog-isHtml").val('false'); // initial state for SendEmail overlay

    $("#sendKickerDivDialog").dialog({ // initializing overlay for SendEmail
        title: 'Send Alert Email',
        autoOpen: false,
        autoResize: true,
        minHeight: 0,
        modal: true,
        width: 1024,
        buttons: {
            Exit: function () {
                $(this).dialog("close");
            },
            Send: function () {
                console.log('Sending alert .. isHtml?' + $('#sendKickerDivDialog-isHtml').val());
                blockUI();
                var urlStr = _context + "/shipment/sendShipmentKicker";
                var data = {
                    emailBody: ($('#sendKickerDivDialog-isHtml').val() == 'true') ? $('#sendKickerDivDialog-emailBody').elrte('val') : $('#sendKickerDivDialog-emailBody').val(),
                    emailTo: $('#sendKickerDivDialog-emailTo').val(),
                    emailCc: $('#sendKickerDivDialog-emailCc').val(),
                    emailSubject: $('#sendKickerDivDialog-emailSubject').val(),
                    shipmentId: $('#sendKickerDivDialog-shipmentId').val(),
                    templateId: $('#sendKickerDivDialog-templateId').val()
                }
                $.ajax({
                    type: "POST",
                    url: urlStr,
                    data: data,
                    dataType: 'json',
                    success: function (responseData) {
                        console.log('Sending alert ... Success');
                        $.unblockUI();
                        alert("Email Alert sent successfully");
                        $(this).dialog("close");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('Sending alert ... Error');
                        $.unblockUI();
                        alert("Email Alert could not be sent");
                        $(this).dialog("close");
                    }
                });
            }
        }
    });
}


function applyAndSendKicker(templateId) {

    blockUI();
    var urlStr = _context +"/shipment/getShipmentKickerSource?shipmentId="+$('#shipmentId').val()+"&templateId="+templateId;
    $.ajax({
        type: "GET",
        url: urlStr,
        dataType:'json',
        success: function(responseData){

            //var length = responseData.data.length ? parseInt(responseData.data.length) : 9999;

            var key = "body=";
            var start = responseData.data.mailto.indexOf(key) + key.length;
            var toEncode = responseData.data.mailto.substring(start);
            var noEncode = responseData.data.mailto.substring(0,start);
            var fullMailTo = noEncode + encodeURIComponent(toEncode);

            var length = fullMailTo.length;

            if (responseData.data.isHtml == 'true' || length > 1500) {

                console.log ('openSendBookingKicker called. templateId:' + templateId);
                $("#kickerTemplatesDivDialog").dialog('close'); // close templates grid
                $("#sendKickerDivDialog").dialog('open'); // opens SendEmail overlay

                if ($('#sendKickerDivDialog-isHtml').val() == 'true') { // if previous email was HTML, then reset Body
                    $('#sendKickerDivDialog-emailBody').elrte('destroy');
                    $('#sendKickerDivDialog-bodyContainer').html("<textarea id='sendKickerDivDialog-emailBody' style='width:950px;height:400px;'></textarea>");
                } else {
                    $('#sendKickerDivDialog-emailBody').val(''); // clear out
                }

                $('#sendKickerDivDialog-form input[type=text]').val(''); // clear out form fields
                $('#sendKickerDivDialog-form input[type=hidden]').val(''); // clear out form fields

                // chrome limit to mailto:
                if (responseData.data.isHtml == 'true') {
                    var opts = {
                        cssClass : 'el-rte',
                        height : 400,
                        width : 900,
                        toolbar : 'web2pyToolbar',
                        cssfiles : [ 'elrte-1.3/css/elrte-inner.css' ]
                    }
                    $("#sendKickerDivDialog-emailBody").elrte(opts).elrte('val', responseData.data.emailBody);
                } else {
                    $("#sendKickerDivDialog-emailBody").val(responseData.data.emailBody);
                }
                $('#sendKickerDivDialog-emailTo').val(responseData.data.emailTo);
                $('#sendKickerDivDialog-emailSubject').val(responseData.data.emailSubject);
                $('#sendKickerDivDialog-emailCc').val(responseData.data.emailCc);
                $('#sendKickerDivDialog-shipmentId').val(responseData.data.shipmentId);
                $('#sendKickerDivDialog-templateId').val(responseData.data.templateId);
                $('#sendKickerDivDialog-isHtml').val(responseData.data.isHtml);
            } else {

                $('#sendKickerHref').attr("href",noEncode + encodeURIComponent(toEncode));
                $('#sendKickerHref')[0].click();
            }

            $.unblockUI();
        },
        error: function(jqXHR,textStatus,errorThrown) {
            $.unblockUI();
            alert("Error getting template "+textStatus);
        }
    });
}

function openSendAlerts() {

    console.log("openSendAlerts - called");

    $( "#alerts-div" ).hide().load( "/gates/on_demand_alerts.html", function() {

        console.log("on_demand_alerts.html load completed.");

        initializeAlertDialogs();

        var kickerColNames = ['Id', 'Category', 'Customer Group', 'Name', 'Description', 'Subject Line', 'From', 'To', 'isHtml', 'CC', 'Create User', 'Create Date', 'User', 'Update Date'];

        var kickerColModel = [
            {name:'templateId', hidden:true, width:25},
            {name:'category', hidden:false, width:90},
            {name:'customerGroups', hidden:false, width:100},
            {name:'name', hidden:false},
            {name:'description', hidden:false},
            {name:'emailSubject', hidden:false},
            {name:'emailFrom', hidden:true},
            {name:'emailTo', hidden:false},
            {name:'isHtml', hidden:true},
            {name:'emailCC', hidden:true},
            {name:'createUser', hidden:true},
            {name:'createDate', hidden:true},
            {name:'lastUpdateUser', hidden:true},
            {name:'lastUpdateDate', hidden:true, "formatter":"date"}
        ];

        var jsonReaderReference = {
            root:"rows",
            page:"page",
            total:"total",
            records:"records",
            repeatitems:false,
            cell:"cell",
            id:"templateId"
        };

        $('#sendKickerGrid').jqGrid({
            url:_context+'/booking/loadEmailTemplates?module=Billing',
            datatype: "json",
            colNames:kickerColNames,
            colModel:kickerColModel,
            rowNum:10,
            pager: '#sendKickerPager',
            viewrecords: true,
            caption:'Templates',
            sortName: 'templateId',
            sortorder: "desc",
            loadonce: true,
            jsonReader : jsonReaderReference,
            height: "100%",
            multiselect: true,
            beforeSelectRow: function(rowid, e){
                jQuery("#sendKickerGrid").jqGrid('resetSelection');
                return(true);
            }
        }).navGrid("#sendKickerPager",{edit:false,add:false,del:false});

        $("#kickerTemplatesDivDialog").dialog('open');

    });

}

