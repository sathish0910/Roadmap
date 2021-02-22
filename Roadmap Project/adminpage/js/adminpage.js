admin = { vars: { admin: [] }, fn: {} };
admin.vars.webUrl = _spPageContextInfo.webAbsoluteUrl;
admin.vars.currentUserId = _spPageContextInfo.userId;
$(document).ready(function () {
    InjectScript.fn.getCurrentUserDetails(InjectScript.vars.webUrl, InjectScript.vars.currentUserId, false).done(function (data) {
        InjectScript.vars.currentUserEmail = data.d.Email;
        InjectScript.vars.currentUserDisplayName = data.d.Title;
    });
    admin.fn.checkForUserMemberOfGroup("IT Reporting Owners", admin.vars.currentUserId).done(function (data) {
        if (data === false) {
            window.location = admin.vars.webUrl;
        } else {
            console.log("You are an admin!!!")
        }
    });
});
admin.fn.checkForUserMemberOfGroup = function (groupName, userId) {
    var dfd = $.Deferred();
    $.ajax({
        url: admin.vars.webUrl + "/_api/web/sitegroups/getByName('" + groupName + "')/Users?$filter=Id eq " + userId,
        contentType: "application/json;odata=verbose",
        headers: { "accept": "application/json; odata=verbose" },
        success: function (data) {
            var userInGroup = (data.d != null && data.d.results != null && data.d.results.length > 0) ? true : false;
            dfd.resolve(userInGroup);
        },
        error: function (error) {
            console.log("Group check failed, " + error.textStatus);
            dfd.reject(JSON.stringify(data));
        }
    });
    return dfd.promise();
};