index = { vars: { index: [] }, fn: {} };
index.vars.webUrl = _spPageContextInfo.webAbsoluteUrl;

$(document).ready(function () {
    index.fn.loadForm(); //hilly billy functionality
    index.fn.common(); //common functionalities
    index.fn.getRequests(); //get all requests from SP list
    index.fn.initilizeFunctions(); //Click or Change functions
});

index.fn.loadForm = function () {
    index.fn.amchart();
}

index.fn.common = function () {
    $("g[aria-labelledby^='id-'][aria-labelledby$='-title']").hide();
}

index.fn.getRequests = function () {
    var usefullLinksQuery = "?$select=ID,Title";
    index.fn.getListItems(index.vars.webUrl, "Useful Links", usefullLinksQuery, true).done(function (data) {
        $.each(data, function (key, value) {
            $('.rounded-list').append('<li><a href="">' + value.Title + '</a></li>')
        })
    });
}

index.fn.initilizeFunctions = function () {

}

index.fn.amchart = function () {

    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv", am4charts.PieChart);
        var title = chart.titles.create();

        //Chart Title
        title.fontSize = 25;
        title.marginBottom = 30;

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "percent";
        pieSeries.dataFields.category = "country";
        // pieSeries.labels.template.disabled = true;

        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart.innerRadius = am4core.percent(30);

        // Put a thick white border around each Slice
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        // change the cursor on hover to make it apparent the object can be interacted with
        pieSeries.slices.template.cursorOverStyle = [
            {
                "property": "cursor",
                "value": "pointer"
            }
        ];

        pieSeries.alignLabels = false;
        pieSeries.labels.template.bent = false;
        pieSeries.labels.template.radius = 3;
        pieSeries.labels.template.padding(0, 0, 0, 0);

        pieSeries.ticks.template.disabled = true;

        // Create a base filter effect (as if it's not there) for the hover to return to
        var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow.opacity = 0;

        // Create hover state
        var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

        // Slightly shift the shadow and make it more prominent on hover
        var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
        hoverShadow.opacity = 0.7;
        hoverShadow.blur = 5;

        // Add a legend
        chart.legend = new am4charts.Legend();
        chart.data = [];
        var taskProgressQuery = "?$select=ID,Title,progressTitle,Percent";
        index.fn.getListItems(index.vars.webUrl, "Task Progress", taskProgressQuery, true).done(function (data) {
            $.each(data, function (key, value) {
                if (value.progressTitle == "IP Cost breakdown Chart") {
                    chart.data.push({
                        "country": value.Title,
                        "percent": value.Percent
                    })
                    title.text = value.progressTitle;
                }
            })
        });

    }); // end am4core.ready()

    am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart1 = am4core.create("chartdiv1", am4charts.PieChart);
        var title1 = chart1.titles.create();
        //Chart Title        
        title1.fontSize = 25;
        title1.marginBottom = 30;

        // Add and configure Series
        var pieSeries1 = chart1.series.push(new am4charts.PieSeries());
        pieSeries1.dataFields.value = "percent";
        pieSeries1.dataFields.category = "country";
        // pieSeries1.labels.template.disabled = true;

        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart1.innerRadius = am4core.percent(30);

        // Put a thick white border around each Slice
        pieSeries1.slices.template.stroke = am4core.color("#fff");
        pieSeries1.slices.template.strokeWidth = 2;
        pieSeries1.slices.template.strokeOpacity = 1;
        // change the cursor on hover to make it apparent the object can be interacted with
        pieSeries1.slices.template.cursorOverStyle = [
            {
                "property": "cursor",
                "value": "pointer"
            }
        ];
        pieSeries1.alignLabels = false;
        pieSeries1.labels.template.bent = false;
        pieSeries1.labels.template.radius = 3;
        pieSeries1.labels.template.padding(0, 0, 0, 0);
        pieSeries1.ticks.template.disabled = true;

        // Create a base filter effect (as if it's not there) for the hover to return to
        var shadow1 = pieSeries1.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow1.opacity = 0;

        // Create hover state
        var hoverState1 = pieSeries1.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

        // Slightly shift the shadow and make it more prominent on hover
        var hoverShadow1 = hoverState1.filters.push(new am4core.DropShadowFilter);
        hoverShadow1.opacity = 0.7;
        hoverShadow1.blur = 5;

        // Add a legend
        chart1.legend = new am4charts.Legend();
        chart1.data = [];
        var taskProgressQuery = "?$select=ID,Title,progressTitle,Percent";
        index.fn.getListItems(index.vars.webUrl, "Task Progress", taskProgressQuery, true).done(function (data) {
            $.each(data, function (key, value) {
                if (value.progressTitle == "Current User Tasks Chart") {
                    chart1.data.push({
                        "country": value.Title,
                        "percent": value.Percent
                    })
                    title1.text = value.progressTitle;
                }
            })
        });

    }); // end am4core.ready()
}

index.fn.getListItems = function (url, listname, query, sync) {
    var dfd = $.Deferred();
    $.ajax({
        url: url + "/_api/web/lists/getbytitle('" + listname + "')/items" + query,
        async: !sync,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            dfd.resolve(data.d.results);
        },
        error: function (data) {
            dfd.reject(JSON.stringify(data));
        }
    });
    return dfd.promise();
};