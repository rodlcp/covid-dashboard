function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

const arrSum = arr => arr.reduce((a,b) => a + b, 0)

function arrDiv(a, b) {
    c = [];
    if( Object.prototype.toString.call( b ) === '[object Array]' ) {
        if( a.length !== b.length ) {
            throw "Array lengths do not match.";
        } else {
            for( var i = 0; i < a.length; i++ ) {
                c[ i ] = a[ i ] / (b[ i ] + 1e-16);
            }
        }
    } else if( typeof b === 'number' ) {
        for( var i = 0; i < a.length; i++ ) {
            c[ i ] = a[ i ] / (b + 1e-16);
        }
    }
    return c;
};

function getData(data, countryId, type, variable, since){
    cases = data[countryId].cases
    deaths = data[countryId].deaths
    n = 0
    if (since == 'since n<sup>th</sup> infected'){
        aux = cases.map((v, i) => arrSum(cases.slice(0,i+1)))
        n = $('#n').val();
        n = arrSum(aux.map((v, i)=> v < n))
    }
    if (type == 'Total'){
        cases = cases.map((v, i) => arrSum(cases.slice(0,i+1)))
        deaths = deaths.map((v, i) => arrSum(deaths.slice(0,i+1)))
    }
    cases = cases.slice(n)
    deaths = deaths.slice(n)
    switch (variable){
        case 'cases': return cases;
        case 'deaths': return deaths;
        case 'cases / population': return arrDiv(cases, data[countryId].population);
        case 'deaths / population': return arrDiv(deaths, data[countryId].population);
        default: return arrDiv(deaths, cases);
    }
}

function updateDashboard() {
    closeNav();
    
    // selected cities and desired chart
    countries = $('#countries').val();
    type = $('#type').val();
    variable = $('#variable').val();
    since = $('#since').val();

    // custom options
    title = $('#title').val();
    if (title == ''){
        title = type + " " + variable + " " + since;
    }
    subtitle = $('#subtitle').val();
    if (subtitle == ''){
        subtitle = "Source: ECDC";
    }

    miny = parseInt($('#miny').val());
    if (isNaN(miny)){
        miny = null;
    }
    maxy = parseInt($('#maxy').val());
    if (isNaN(maxy)){
        maxy = null;
    }

    options = {
        chart: {
            zoomType: 'x',
        },
        title: {
            useHTML: true,
            text: title
        },
        subtitle:{
            text: subtitle
        },
        tooltip:{
            shared: true
        },
        yAxis: {
            title: {
                text: ""
            }
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                },
            },
        }
    }

    if (variable != 'cases' && variable != 'deaths'){
        options.tooltip.valueDecimals =  6
    }

    if (since == "since n<sup>th</sup> infected"){
        options["xAxis"] = {
            title: {
                useHTML: true,
                text: "Days after " + $("#n").val() + "<sup>th</sup> infected"
            }
        }
    } else {
        options["xAxis"] = {
            type: 'datetime',
            min: Date.UTC(2019,11,29,0,0,0,0)
        }
    }

    chart = Highcharts.chart('chart', options);

    for (country in countries){
        countryId = countries[country]
        aux = {
            name: data[countryId].name,
            type: 'spline',
            data: getData(data, countryId, type, variable, since)
        }
        if (since != "since n<sup>th</sup> infected"){
            aux.pointStart= Date.UTC(2019,11 ,29,0,0,0,0),
            aux.pointInterval= 3600 * 1000 * 24
        }
        chart.addSeries(aux)
    }
    return chart
}

