Teams = { vars: { Teams: [] }, fn: {} };
Teams.vars.webUrl = _spPageContextInfo.webAbsoluteUrl;
Teams.vars.pageId = _spPageContextInfo.pageItemId;
Teams.vars.currentUserName = _spPageContextInfo.userDisplayName;
Teams.vars.currentUserEmail = _spPageContextInfo.userEmail;
Teams.vars.listNames = {
    directors_ListName: "Directors",
    managers_ListName: "Managers",
    teamLeads_ListName: "TeamLead",
    members_ListName: "Members",
    task_listName: "Task List"
};
Teams.vars.directorsData = [];
Teams.vars.managersData = [];
Teams.vars.leadsData = [];
Teams.vars.membersData = [];
Teams.vars.tasksDetails = [];
// Summary : On load function
$(document).ready(function () {
    Teams.fn.InitializeFunctions();
});

// Summary : Function to initilize calendar event model dialogs and toggles etc...
Teams.fn.InitializeFunctions = function () {
    Teams.fn.getTeamsDetails(Teams.vars.teamName);
    Teams.fn.bindChartDetails();
}

// Summary : Function to get team details by filtered url paramater from current window url
Teams.fn.getTeamsDetails = function (teamName) {
    var Query = "?$select=ID,Title,Cost,StartDateTime,EndDateTime,Owner/Title,Owner/EMail,Owner/ID&$expand=Owner&$top=5000";
    InjectScript.fn.getListItems(Teams.vars.webUrl, Teams.vars.listNames.task_listName, Query, true).done(function (data) {
        Teams.vars.tasksDetails = data;
    });
    var query = "?$select=Id,Title,Directors/Id,Directors/Title,Directors/EMail,Directors/JobTitle&$expand=Directors";
    InjectScript.fn.getListItems(Teams.vars.webUrl, Teams.vars.listNames.directors_ListName, query, true).done(function (data) {
        Teams.vars.directorsDetails = data;
        for (var i = 0; i < data.length; i++) {
            Teams.vars.directorsData.push({ "ID": data[i].ID, "Title": data[i].Directors.Title, "JobTitle": data[i].Directors.JobTitle, "Email": data[i].Directors.EMail })
        }
    });
    var query = "?$select=Id,Title,PID,Managers/Id,Managers/Title,Managers/EMail,Managers/JobTitle,Directors/Id,Directors/Title,Directors/EMail,Directors/JobTitle&$expand=Managers,Directors";
    InjectScript.fn.getListItems(Teams.vars.webUrl, Teams.vars.listNames.managers_ListName, query, true).done(function (data) {
        Teams.vars.managersDetails = data;
        for (var i = 0; i < data.length; i++) {
            Teams.vars.managersData.push({ "ID": Teams.vars.directorsData[Teams.vars.directorsData.length - 1].ID + 1 + i, "Title": data[i].Managers.Title, "JobTitle": data[i].Managers.JobTitle, "Email": data[i].Managers.EMail, "DirectorTitle": data[i].Directors.Title, "DirectorEmail": data[i].Directors.EMail, "PID": Teams.vars.directorsDetails.length });
        }
    });
    var query = "?$select=Id,Title,TeamLead/Id,TeamLead/Title,TeamLead/EMail,TeamLead/JobTitle,Managers/Id,Managers/Title&$expand=TeamLead,Managers&$top=1000";
    InjectScript.fn.getListItems(Teams.vars.webUrl, Teams.vars.listNames.teamLeads_ListName, query, true).done(function (data) {
        Teams.vars.leadsDetails = data;
        for (var i = 0; i < data.length; i++) {
            for (j = 0; j < Teams.vars.managersData.length; j++) {
                if (Teams.vars.managersData[j].Title == data[i].Managers.Title) {
                    PID = Teams.vars.managersData[j].ID;
                }
            }
            Teams.vars.leadsData.push({ "ID": Teams.vars.managersData[Teams.vars.managersData.length - 1].ID + 1 + i, "Title": data[i].TeamLead.Title, "JobTitle": data[i].TeamLead.JobTitle, "Email": data[i].TeamLead.EMail, "ManagerTitle": data[i].Managers.Title, "PID": PID });
        }
    });
    var query = "?$select=Id,Title,Members/Id,Members/Title,Members/EMail,Members/JobTitle,TeamLead/Id,TeamLead/Title&$expand=Members,TeamLead&$top=1000";
    InjectScript.fn.getListItems(Teams.vars.webUrl, Teams.vars.listNames.members_ListName, query, true).done(function (data) {
        Teams.vars.membersDetails = data;
        for (var i = 0; i < data.length; i++) {
            for (j = 0; j < Teams.vars.leadsData.length; j++) {
                if (Teams.vars.leadsData[j].Title == data[i].TeamLead.Title) {
                    PID = Teams.vars.leadsData[j].ID;
                }
            }
            Teams.vars.membersData.push({ "ID": Teams.vars.leadsData[Teams.vars.leadsData.length - 1].ID + 1 + i, "Title": data[i].Members.Title, "JobTitle": data[i].Members.JobTitle, "Email": data[i].Members.EMail, "LeadTitle": data[i].TeamLead.Title, "PID": PID });
        }
    });
}

Teams.fn.bindChartDetails = function () {
    OrgChart.templates.rony.field_0 = '<clipPath id="imgID"><circle cx="90" cy="70" r="60"></circle></clipPath><image class="field_0" preserveAspectRatio="xMidYMid slice" clip-path="url(#imgID)" xlink:href="{val}" x="30" y="5" width="120" height="120"></image>';
    OrgChart.templates.rony.field_1 = '<text width="150" text-overflow="ellipsis" class="field_1" style="font-size: 13px; font-weight: bold" fill="rgb(3, 155, 229)" x="90" y="150" text-anchor="middle">{val}</text>';
    // OrgChart.templates.rony.field_2 = '<text width="150" text-overflow="multiline" class="field_2" style="font-size: 12px;" fill="rgb(245, 124, 0)" x="90" y="170" text-anchor="middle">{val}</text>';
    OrgChart.templates.rony.field_2 = '<g class="field_2" transform="matrix(0.07,0,0,0.07,135,153)"><a target="_blank" xlink:href="mailto:{val}"><path style="fill:#3A559F;" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256C511.835,114.683,397.317,0.165,256,0z     M256,490.667C126.397,490.667,21.333,385.603,21.333,256S126.397,21.333,256,21.333S490.667,126.397,490.667,256    C490.52,385.542,385.542,490.52,256,490.667z"/><path style="fill:#3A559F;" d="M426.464,169.685c0.003-0.539-0.036-1.078-0.117-1.611c-0.075-0.299-0.267-0.544-0.373-0.843    c-0.172-0.496-0.383-0.977-0.629-1.44c-0.602-1.114-1.376-2.125-2.293-2.997c-0.629-0.55-1.324-1.019-2.069-1.397    c-0.363-0.231-0.74-0.438-1.131-0.619c-1.224-0.496-2.53-0.76-3.851-0.779H96c-1.321,0.019-2.626,0.283-3.851,0.779    c-0.39,0.181-0.768,0.388-1.131,0.619c-0.745,0.378-1.44,0.847-2.069,1.397c-0.917,0.872-1.691,1.884-2.293,2.997    c-0.247,0.463-0.457,0.944-0.629,1.44c-0.107,0.299-0.299,0.544-0.373,0.843c-0.081,0.533-0.121,1.072-0.117,1.611    c-0.084,0.323-0.152,0.651-0.203,0.981v170.667v0.117c0.006,1.162,0.204,2.316,0.587,3.413c0,0.117,0.128,0.203,0.171,0.32    c0.158,0.369,0.343,0.725,0.555,1.067c0.395,0.767,0.883,1.484,1.451,2.133c0.294,0.311,0.603,0.607,0.928,0.885    c0.646,0.57,1.363,1.054,2.133,1.44c0.352,0.181,0.683,0.384,1.067,0.533c1.202,0.479,2.482,0.736,3.776,0.757h320    c1.291-0.023,2.566-0.279,3.765-0.757c0.373-0.149,0.704-0.352,1.067-0.533c0.767-0.392,1.483-0.876,2.133-1.44    c0.325-0.279,0.635-0.574,0.928-0.885c0.57-0.648,1.058-1.365,1.451-2.133c0.211-0.341,0.397-0.698,0.555-1.067    c0-0.117,0.128-0.203,0.171-0.32c0.382-1.098,0.581-2.251,0.587-3.413l0.011-0.117V170.667    C426.616,170.336,426.548,170.009,426.464,169.685z M373.333,181.333L256,243.915l-117.333-62.581H373.333z M106.667,188.448    l98.016,52.267l-98.016,78.421V188.448z M126.411,330.667l98.763-79.019l25.803,13.76c3.14,1.676,6.908,1.676,10.048,0    l25.803-13.76l98.763,79.019H126.411z M405.333,319.136l-98.016-78.411l98.016-52.277V319.136z"/></a></g>';
    OrgChart.templates.rony.field_3 = '<text class="field_3">{val}</text>';
    OrgChart.templates.rony.field_4 = '<text width="100" text-overflow="ellipsis" class="field_4" style="font-size: 12px; font-weight: bold" fill="rgb(245, 124, 0)" x="70" y="175" text-anchor="middle">{val}</text>'

    OrgChart.templates.rony.node += '<g class="svg-btn"><rect x="70" y="200" width="100" height="30" rx="5" ry="5" fill="#5514b4"></rect><text style="font-size: 12px;" fill="#FFF" x="120" y="220" text-anchor="middle">Task Details</text></g>';

    var chart = new OrgChart(document.getElementById("tree"), {
        mouseScrool: OrgChart.action.scroll,
        showYScroll: OrgChart.scroll.visible,
        showXScroll: OrgChart.scroll.visible,
        lazyLoading: true,
        nodeMouseClick: OrgChart.action.expandCollapse,
        enableSearch: false,
        template: "rony",
        toolbar: {
            layout: false,
            zoom: true,
            fit: true,
            expandAll: false,
            fullScreen: true
        },
        collapse: {
            level: 1,
            allChildren: true
        },
        nodeBinding: {
            field_0: "img",
            field_1: "name",
            field_2: "email",
            field_3: "Role",
            field_4: "JobTitle"
        },
        nodes: [
            { id: "1", img: "../_layouts/15/userphoto.aspx?size=L&username=" + Teams.vars.directorsData[0].Email, name: Teams.vars.directorsData[0].Title, email: Teams.vars.directorsData[0].Email, Role: "Director", JobTitle: Teams.vars.directorsData[0].JobTitle }
        ],
    });

    $.each(Teams.vars.managersDetails, function (key, value) {
        chart.add({ id: Teams.vars.managersData[key].ID, pid: Teams.vars.managersData[key].PID, img: "../_layouts/15/userphoto.aspx?size=L&username=" + Teams.vars.managersData[key].Email, name: Teams.vars.managersData[key].Title, email: Teams.vars.managersData[key].Email, Role: "Manager", JobTitle: Teams.vars.managersData[key].JobTitle });
    })

    $.each(Teams.vars.leadsDetails, function (key, value) {
        chart.add({ id: Teams.vars.leadsData[key].ID, pid: Teams.vars.leadsData[key].PID, img: "../_layouts/15/userphoto.aspx?size=L&username=" + Teams.vars.leadsData[key].Email, name: Teams.vars.leadsData[key].Title, email: Teams.vars.leadsData[key].Email, Role: "Lead", JobTitle: Teams.vars.leadsData[key].JobTitle });
    })

    $.each(Teams.vars.membersDetails, function (key, value) {
        chart.add({ id: Teams.vars.membersData[key].ID, pid: Teams.vars.membersData[key].PID, img: "../_layouts/15/userphoto.aspx?size=L&username=" + Teams.vars.membersData[key].Email, name: Teams.vars.membersData[key].Title, email: Teams.vars.membersData[key].Email, Role: "Member", JobTitle: Teams.vars.membersData[key].JobTitle });
    })

    chart.draw(OrgChart.action.init);

    chart.on('redraw', function () {
        var btns = document.querySelectorAll('.svg-btn');
        var ebtns = document.querySelectorAll('.field_2');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if($($(this.parentNode).find('.field_1').children()).length != 0)
                {
                    Teams.vars.parentTitle = $($(this.parentNode).find('.field_1').children()).text()
                } else  {
                    Teams.vars.parentTitle = $($(this.parentNode).find('.field_1')).text()
                }
                Teams.vars.parentEmail = $($(this.parentNode).find('a')).attr('xlink:href')
                Teams.vars.parentEmail = Teams.vars.parentEmail.substring(Teams.vars.parentEmail.length, 7);
                Teams.vars.role = $($(this.parentNode).find('.field_3')).text()
                Teams.fn.getTaskDetails(Teams.vars.parentEmail, Teams.vars.role);
            })
            ebtns[i].addEventListener('click', function (e) {
                e.stopPropagation();
            })
        }
    });
}

Teams.fn.getTaskDetails = function (parentEmail, role) {
    Teams.vars.ganttViewData = [];
    Teams.vars.finalData = [];
    Teams.vars.finalTasks = [];
    Teams.vars.finalData = Teams.fn.findUsersUnderParentUser(parentEmail, role);
    $.each(Teams.vars.finalData, function (index, temp) {
        var tasks = _.filter(Teams.vars.tasksDetails, function (val) {
            return val.Owner.EMail === temp.Email;
        });
        $.each(tasks, function (index, temp1) {
            Teams.vars.finalTasks.push({
                "name": temp1.Title,
                "start": new Date(new Date(temp1.StartDateTime).toISOString()),
                "end": new Date(new Date(temp1.EndDateTime).toISOString()),
                "cost": temp1.Cost,
                "owner": temp1.Owner.Title
            });
        });
    });
    var count = 0;
    $.each(_.groupBy(Teams.vars.finalTasks, 'owner'), function (index, temp) {
        Teams.vars.ganttViewData.push({
            "id": (count + 1),
            "name": temp[0].owner,
            "series": temp
        });
        count = (count + 1);
    });
    if (Teams.vars.ganttViewData.length === 0) {
        alert("No task are assigned");

    } else {
        $('.ganttTitle').html(Teams.vars.parentTitle+"'s Task Details")
        $("#ganttChart").ganttView({
            data: Teams.vars.ganttViewData,
            slideWidth: 900,
            behavior: {
                onClick: function (data) {
                    var header = "Owner: " + data.owner;
                    var body = "<div><b>Demand: </b>" + data.name + ",</diV><div><b>Cost: </b>" + data.cost + ",</diV><div><b>Start: </b>" + new Date(data.start).format("d/MMM/yyy") + ",</diV><div><b>End: </b>" + new Date(data.end).format("d/MMM/yyy") + " </diV>";
                    $("#myModal").modal('show');
                    $(".taskTitle").html(header);
                    $(".taskBody").html(body);
                }
            }
        });
        $("#modalChart").modal('show');
        $(".modal-backdrop").removeAttr("style").addClass("customStyle");
        $(".modal-backdrop").removeClass("modal-backdrop");
        $(".ganttClose").click(function () {
            $("#ganttChart").empty();
        })
    }
}

Teams.fn.findUsersUnderParentUser = function (parentUserEmail, currentUserRole) {
    Teams.vars.finalUsersList = [];
    Teams.vars.usersList = [];
    Teams.vars.directors = [];
    Teams.vars.managers = [];
    Teams.vars.leads = [];
    Teams.vars.members = [];
    Teams.vars.usersList = Teams.vars.usersList.concat(Teams.vars.directorsData, Teams.vars.managersData, Teams.vars.leadsData, Teams.vars.membersData);
    switch (currentUserRole) {
        case "Director":
            Teams.vars.directors = _.filter(Teams.vars.usersList, function (val) {
                return val.Email === parentUserEmail;
            });
            Teams.vars.managers = [];
            $.each(Teams.vars.directors, function (index, val) {
                var directorManagers = _.filter(Teams.vars.usersList, function (temp) {
                    return temp.DirectorTitle === val.Title;
                });
                Teams.vars.managers = Teams.vars.managers.concat(directorManagers);
            });
            Teams.vars.leads = [];
            $.each(Teams.vars.managers, function (index, val) {
                var managerLeads = _.filter(Teams.vars.usersList, function (temp) {
                    return temp.ManagerTitle === val.Title;
                });
                Teams.vars.leads = Teams.vars.leads.concat(managerLeads);
            });
            Teams.vars.members = [];
            $.each(Teams.vars.leads, function (index, val) {
                var leadMembers = _.filter(Teams.vars.usersList, function (temp) {
                    return temp.LeadTitle === val.Title;
                });
                Teams.vars.members = Teams.vars.members.concat(leadMembers);
            });
            Teams.vars.finalUsersList = Teams.vars.finalUsersList.concat(Teams.vars.directors, Teams.vars.managers, Teams.vars.leads, Teams.vars.members);
            return Teams.vars.finalUsersList;
        case "Manager":
            Teams.vars.managers = _.filter(Teams.vars.usersList, function (val) {
                return val.Email === parentUserEmail;
            });
            Teams.vars.leads = [];
            $.each(Teams.vars.managers, function (index, val) {
                var managerLeads = _.filter(Teams.vars.usersList, function (temp) {
                    return temp.ManagerTitle === val.Title;
                });
                Teams.vars.leads = Teams.vars.leads.concat(managerLeads);
            });
            Teams.vars.members = [];
            $.each(Teams.vars.leads, function (index, val) {
                var leadMembers = _.filter(Teams.vars.usersList, function (temp) {
                    return temp.LeadTitle === val.Title;
                });
                Teams.vars.members = Teams.vars.members.concat(leadMembers);
            });
            Teams.vars.finalUsersList = Teams.vars.finalUsersList.concat(Teams.vars.directors, Teams.vars.managers, Teams.vars.leads, Teams.vars.members);
            return Teams.vars.finalUsersList;
        case "Lead":
            Teams.vars.leads = _.filter(Teams.vars.usersList, function (val) {
                return val.Email === parentUserEmail;
            });
            Teams.vars.members = [];
            $.each(Teams.vars.leads, function (index, val) {
                var leadMembers = _.filter(Teams.vars.usersList, function (temp) {
                    return temp.LeadTitle === val.Title;
                });
                Teams.vars.members = Teams.vars.members.concat(leadMembers);
            });
            Teams.vars.finalUsersList = Teams.vars.finalUsersList.concat(Teams.vars.directors, Teams.vars.managers, Teams.vars.leads, Teams.vars.members);
            return Teams.vars.finalUsersList;
        case "Member":
            Teams.vars.members = _.filter(Teams.vars.usersList, function (val) {
                return val.Email === parentUserEmail;
            });
            Teams.vars.finalUsersList = Teams.vars.finalUsersList.concat(Teams.vars.directors, Teams.vars.managers, Teams.vars.leads, Teams.vars.members);
            return Teams.vars.finalUsersList;
    }
}