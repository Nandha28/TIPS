/**
 * Created by Selvaraj on 8/2/2015.
 */

function getURL(){
    var strCampus = "ERODE";
    if(localStorage.getItem("ServiceFrom")!=null)
    {
         strCampus = localStorage.getItem("ServiceFrom");
    }

    if(strCampus === "ERODE"){
          localStorage.setItem("ServiceFrom","ERODE");
          return " http://icampus.theindianpublicschool.org:8087/TIPSMobileAppService.svc?wsdl";
    }else{
        localStorage.setItem("ServiceFrom","CBE");
       //return "http://117.239.246.86:8087/TIPSMobileAppService.svc?wsdl";
        return "http://203.112.152.22:8087/TIPSMobileAppService.svc?wsdl";
    }
}


var login = {

    request : function () {

    if(navigator.network.connection.type == Connection.NONE || navigator.network.connection.type == Connection.UNKNOWN){
                    notify('Sorry, you are offline.', 'warning');
                }else{
        //localStorage.clear();


        var $username = $("#userName");
        var $password = $("#password");
        var userName = $username.val().trim();
        var password = $password.val().trim();


        if (userName == "") {
            notify('Please enter a Username.', 'warning');
            //$username.focus();

        } else if (password == "") {
            notify('Please enter a Password.', 'warning');
            //$password.focus();

        } else {
           $(".preloader").show();

            var xmlhttp = new XMLHttpRequest();


            var soapRequest = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                "<s:Header>" +
                "</s:Header>" +
                "<s:Body>" +
                "<LoginAndGetUser xmlns=\"http://tempuri.org/\">" +
                "<UserId>"+userName+"</UserId>" +
                "<Password>"+password+"</Password>" +
                "</LoginAndGetUser>" +
                "</s:Body>" +
                "</s:Envelope>";


            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState===4){
                     if ((xmlhttp.status == 200) || (xmlhttp.status == 0))
                        {

                    var xml = xmlhttp.responseText, xmlDoc = $.parseXML(xml);

                    alert(xml);

                    var arrayLoginDetails =[];
                    $(xmlDoc).find("LoginAndGetUserResult").each(function () {
                        var objLoginDetails = {};
                        alert("Inside LoginAndGetUserResult");
                        objLoginDetails.UserId = $(this).find("a\\:UserId").text();
                        objLoginDetails.Campus = $(this).find("a\\:Campus").text();
                        objLoginDetails.IsActive = $(this).find("a\\:IsActive").text();

                        arrayLoginDetails.push(objLoginDetails);

                        alert("result set"+$(this).find("UserId").text());

                    });
                    for(var i = 0; i < arrayLoginDetails.length; i++) {
                    alert(""+arrayLoginDetails.length);
                    alert(""+arrayLoginDetails[i].IsActive);
                        if(arrayLoginDetails[i].IsActive){
                            $(".preloader").hide();
                            localStorage.setItem("mUserId",JSON.stringify(arrayLoginDetails[i].UserId));
                            localStorage.setItem("mCampus",JSON.stringify(arrayLoginDetails[i].Campus));
                            document.location.href = "index.html";
                        }else{
                         if(localStorage.getItem("ServiceFrom")==="CBE"){
                                                    $(".preloader").hide();
                                                   notify('###User Id or Password is incorrect. Please provide the registered UserId', 'warning');

                                                }else{
                         $(".preloader").hide();
                            localStorage.setItem("ServiceFrom", "CBE");
                            login.request();
                            }
                        }
                    }

                    if(arrayLoginDetails.length==0){
                         var strCampus = localStorage.getItem("ServiceFrom");
                            if(strCampus == "CBE"){
                                $(".preloader").hide();
                                notify('@@@User Id or Password is incorrect. Please provide the registered UserId', 'warning');
                            }else{
                             $(".preloader").hide();
                                localStorage.setItem("ServiceFrom", "CBE");
                                login.request();

                            }
                    }
                }else  {
                         if(localStorage.getItem("ServiceFrom")==="CBE"){
                            $(".preloader").hide();
                           notify('User Id or Password is incorrect. Please provide the registered UserId', 'warning');

                        }else{
                            $(".preloader").hide();
                             localStorage.setItem("ServiceFrom", "CBE");
                             login.request();

                        }

                                 }
                }
            }
            xmlhttp.open('POST', getURL(), true);
            xmlhttp.setRequestHeader('SOAPAction', 'http://tempuri.org/ITIPSMobileAppService/LoginAndGetUser');
            xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
            xmlhttp.send(soapRequest);// sending request data*!/

        }
        }
    }

};

function studentDetails() {
    var strUserId = JSON.parse(localStorage.getItem("mUserId"));

    localStorage.setItem("arrayStudentDetails","");

    var arrayStudentDetails =[];
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', getURL(), true);
    var soapRequest="<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
        "<s:Header>" +
        "</s:Header>" +
        "<s:Body>" +
        "<GetStudentDetails xmlns=\"http://tempuri.org/\">" +
        "<userId>"+strUserId+"</userId>" +
        "</GetStudentDetails>" +
        "</s:Body>" +
        "</s:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
            }
        }

        var xml = xmlhttp.responseText, xmlDoc = $.parseXML(xml);

        $(xmlDoc).find('GetStudentDetailsResult').each(function () {
            var objStudentDetails = {};

            objStudentDetails.Campus = $(this).find('a\\:Campus').text();
            objStudentDetails.Name = $(this).find('a\\:Name').text();
            objStudentDetails.NewId = $(this).find('a\\:NewId').text();
            objStudentDetails.Grade = $(this).find('a\\:Grade').text();
            objStudentDetails.Section = $(this).find('a\\:Section').text();
            objStudentDetails.DOB = $(this).find('a\\:DOB').text();
            objStudentDetails.Gender = $(this).find('a\\:Gender').text();
            objStudentDetails.BGRP = $(this).find('a\\:BGRP').text();
            objStudentDetails.Transport = $(this).find('a\\:Transport').text();
            objStudentDetails.BoardingType = $(this).find('a\\:BoardingType').text();
            objStudentDetails.Food = $(this).find('a\\:FoodPreference').text();
            objStudentDetails.EmailId = $(this).find('a\\:EmailId').text();


            arrayStudentDetails.push(objStudentDetails);

            localStorage.setItem("grade",JSON.stringify($(this).find('Grade').text()));
            localStorage.setItem("email",JSON.stringify($(this).find('EmailId').text()));
            localStorage.setItem("section",JSON.stringify($(this).find('Section').text()));
            localStorage.setItem("stuName",JSON.stringify($(this).find('Name').text()));
            localStorage.setItem("stuNumber",JSON.stringify($(this).find('NewId').text()));

            var strGrade = $(this).find('Grade').text();
                    if(!(strGrade=="VI" || strGrade=="VII" || strGrade=="VIII" || strGrade=="IX" || strGrade=="X")){
                        document.getElementById("editMenu").children[1].style.display = "none"
                    }

        });

        localStorage.setItem("arrayStudentDetails",JSON.stringify(arrayStudentDetails));

    }
    xmlhttp.setRequestHeader('SOAPAction', 'http://tempuri.org/ITIPSMobileAppService/GetStudentDetails');
    xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
    xmlhttp.send(soapRequest);
};


function GeneralNotification() {


};


function issueGroup(stuGrade) {
 $(".preloader").show();
 var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST',getURL(), true);
            var soapRequest="<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                    "<s:Header>" +
                    "</s:Header>" +
                    "<s:Body>" +
                    "<GetIssueGroupMasterGradeWiseListWithPagingAndCriteria xmlns=\"http://tempuri.org/\">"+
                    "<studGrade>"+stuGrade+"</studGrade>"+
                    "</GetIssueGroupMasterGradeWiseListWithPagingAndCriteria>" +
                    "</s:Body>" +
                    "</s:Envelope>";



            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                    }
                }
                var xml = xmlhttp.responseText, xmlDoc = $.parseXML(xml);

                var arrayIssueGroup =[];
                $(xmlDoc).find('GetIssueGroupMasterGradeWiseListWithPagingAndCriteriaResult').each(function () {
                    arrayIssueGroup = [];
                     for(var i = 0; i < xmlDoc.getElementsByTagName("string").length; i++) {
                        arrayIssueGroup.push(xmlDoc.getElementsByTagName("string")[i].childNodes[0].nodeValue);
                     }

                      var groupSelect = document.getElementById('issueGroup');
                      while (groupSelect.firstChild) {
                        groupSelect.removeChild(groupSelect.firstChild);
                        }
                        for(var i = 0; i < arrayIssueGroup.length; i++) {
                            var el = document.createElement('option');
                             el.text = arrayIssueGroup[i];
                             groupSelect.appendChild(el);
                        }


                        var strGroup = groupSelect.options[groupSelect.selectedIndex].text;

                        issueType(strGroup);
                });


            }
            xmlhttp.setRequestHeader('SOAPAction', 'http://tempuri.org/ITIPSMobileAppService/GetIssueGroupMasterGradeWiseListWithPagingAndCriteria');
            xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
            xmlhttp.send(soapRequest);

};


function issueType(selectedGroup) {
 var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST',getURL(), true);
            var soapRequest="<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                    "<s:Header>" +
                    "</s:Header>" +
                    "<s:Body>" +
                    "<GetIssueTypeMasterListWithPagingAndCriteria xmlns=\"http://tempuri.org/\">" +
                    "<IssueGroup>"+selectedGroup+"</IssueGroup>" +
                    "</GetIssueTypeMasterListWithPagingAndCriteria>" +
                    "</s:Body>" +
                    "</s:Envelope>";



            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                    }
                }
                var xml = xmlhttp.responseText, xmlDoc = $.parseXML(xml);

                var arrayIssueType =[];
                $(xmlDoc).find('GetIssueTypeMasterListWithPagingAndCriteriaResult').each(function () {
                    arrayIssueType = [];
                     for(var i = 0; i < xmlDoc.getElementsByTagName("string").length; i++) {
                        arrayIssueType.push(xmlDoc.getElementsByTagName("string")[i].childNodes[0].nodeValue);
                     }

                      var groupSelect = document.getElementById('issueType');
                      while (groupSelect.firstChild) {
                        groupSelect.removeChild(groupSelect.firstChild);
                        }
                        for(var i = 0; i < arrayIssueType.length; i++) {
                            $(".preloader").hide();
                            var el = document.createElement('option');
                            el.text = arrayIssueType[i];
                            groupSelect.appendChild(el);
                        }

                        if(arrayIssueType.length==0){
                            $(".preloader").hide();
                            var el = document.createElement('option');
                            el.text = "Select One";
                            groupSelect.appendChild(el);
                        }
                });


            }
            xmlhttp.setRequestHeader('SOAPAction', 'http://tempuri.org/ITIPSMobileAppService/GetIssueTypeMasterListWithPagingAndCriteria');
            xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
            xmlhttp.send(soapRequest);

};




/*
 * Bootstrap Growl - Notifications popups
 */
function notify(message, type){
    $.growl({
        message: message
    },{
        type: type,
        allow_dismiss: false,
        label: 'Cancel',
        placement: {
            from: 'bottom',
            align: 'center'
        },
        delay: 2500,
        animate: {
            enter: 'animated fadeInUp',
            exit: 'animated fadeOutDown'
        },
        offset: {
            x: 20,
            y: 85
        }
    });
};



function encodeToBase64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}