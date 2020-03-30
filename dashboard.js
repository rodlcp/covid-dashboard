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

function arrMul(a, b) {
    c = [];
    if( Object.prototype.toString.call( b ) === '[object Array]' ) {
        if( a.length !== b.length ) {
            throw "Array lengths do not match.";
        } else {
            for( var i = 0; i < a.length; i++ ) {
                c[ i ] = a[ i ] * b[ i ];
            }
        }
    } else if( typeof b === 'number' ) {
        for( var i = 0; i < a.length; i++ ) {
            c[ i ] = a[ i ] * b;
        }
    }
    return c;
};

function getData(data, countryId, type, variable, since, infected){
    cases = data[countryId].cases
    deaths = data[countryId].deaths
    n = 0
    if (since == 'since n<sup>th</sup> infected'){
        aux = cases.map((v, i) => arrSum(cases.slice(0,i+1)))
        n = arrSum(aux.map((v, i)=> v < infected))
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
        case 'cases / population': return arrMul(arrDiv(cases, data[countryId].population), 100000);
        case 'deaths / population': return arrMul(arrDiv(deaths, data[countryId].population), 100000);
        default: return arrMul(arrDiv(deaths, cases), 100);
    }
}

function getOrdinary(){
    n = $("#n").val()
    if (n == 1){
        return "1<sup>st</sup>";
    } else if (n == 2){
        return "2<sup>nd</sup>";
    } else if (n == 3){
        return "3<sup>rd</sup>";
    } else {
        return n + "<sup>th</sup>";
    }
}

function dealTitle(type, variable, since){
    title = $('#title').val();
    if (title == ''){
        if (type == '3'){
            title = 'Total cases x daily cases'
        } else {
            title = type + " " + variable;
            if (since == 'since n<sup>th</sup> infected'){
                title = title + " since " + getOrdinary() + " infected"
            } else{
                title = title + " since 31/12/2019"
            }
        }
    }
    return title
}

function updateDashboard() {
    closeNav();
    
    // selected cities and desired chart
    countries = $('#countries').val();
    type = $('#type').val();
    variable = $('#variable').val();
    since = $('#since').val();
    n = $('#n').val();

    // custom options
    
    title = dealTitle(type, variable, since)
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
        xAxis: {
            type: $('#xType').val()
        },
        yAxis: {
            title: {
                text: ""
            },
            type: $('#yType').val()
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                },
            },
        }
    }

    if (type == '3'){
        options.xAxis.title = {
            useHTML: true,
            text: "Total cases"
        }
        options.yAxis.title = {
            useHTML: true,
            text: "Daily cases"
        }
    } else {
        if (variable != 'cases' && variable != 'deaths'){
            options.tooltip.valueDecimals =  2
            options.tooltip.valueSuffix = ' per 100 000'
            options.yAxis.title.text = ' per 100 000'
        }
    
        if (since == "since n<sup>th</sup> infected"){
            options.xAxis.title = {
                useHTML: true,
                text: "Days after " + getOrdinary() + " infected"
            }
        } else {
            options.xAxis.type = 'datetime'
            options.xAxis.min = Date.UTC(2019,11,31,0,0,0,0)
        }
    }
    
    chart = Highcharts.chart('chart', options);

    for (country in countries){
        countryId = countries[country]
        countryData = {
            name: data[countryId].name,
            type: 'spline',
        }
        if (type == '3'){
            daily = getData(data, countryId, 'Daily', 'cases', "since n<sup>th</sup> infected", 1)
            countryData.data = getData(data, countryId, 'Total', 'cases', "since n<sup>th</sup> infected", 1).map((v, i)=>[v, daily[i]])
        } else {
            countryData.data = getData(data, countryId, type, variable, since, n)
            if (since != "since n<sup>th</sup> infected"){
                countryData.pointStart= Date.UTC(2019,11,31,0,0,0,0),
                countryData.pointInterval= 3600 * 1000 * 24
            }
        }
        chart.addSeries(countryData)
    }
    return chart
}

