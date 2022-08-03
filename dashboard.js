window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  
function openNav() {
    if (mobilecheck()){
        document.getElementById("mySidenav").style.width = "100%";
    } else {
        document.getElementById("mySidenav").style.width = "400px";
    }
    
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
    k = 0
    if (since == 'since n<sup>th</sup> infected'){
        aux = cases.map((v, i) => arrSum(cases.slice(0,i+1)))
        k = arrSum(aux.map((v, i)=> v < infected))
    }
    if (type.includes('Total')){
        cases = cases.map((v, i) => arrSum(cases.slice(0,i+1)))
        deaths = deaths.map((v, i) => arrSum(deaths.slice(0,i+1)))
    }
    cases = cases.slice(k)
    deaths = deaths.slice(k)
    switch (variable){
        case 'cases': return cases;
        case 'deaths': return deaths;
        case 'cases / population': return arrMul(arrDiv(cases, data[countryId].population), 100000);
        case 'deaths / population': return arrMul(arrDiv(deaths, data[countryId].population), 100000);
        default: return arrMul(arrDiv(deaths, cases), 100000);
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
            title = 'Total ' + variable + ' x weekly ' + variable
        } else {
            title = type + " " + variable;
            if (since == 'since n<sup>th</sup> infected'){
                title = title + " since " + getOrdinary() + " infected"
            } else{
                title = title + " since 03/01/2020"
            }
        }
    }
    return title
}

function plotSeries(){
    type = $('#type').val();

    
    // selected cities and desired chart
    countries = $('#countries').val();
    variable = $('#variable').val();
    since = $('#since').val();
    n = $('#n').val();

    // custom options
    
    title = dealTitle(type, variable, since)
    subtitle = $('#subtitle').val();
    if (subtitle == ''){
        subtitle = "Data Source: WHO";
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
            zoomType: 'x'
        },
        colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1", "#E8ABEB"],
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
        exporting: {
            chartOptions: {
                legend: {
                    itemStyle: {
                        fontSize: '5.5pt'
                    }
                }
            }
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                },
            },
        },
        series: [
        ]
    }

    if (type == '3'){
        options.xAxis.title = {
            useHTML: true,
            text: "Total " + variable
        }
        options.yAxis.title = {
            useHTML: true,
            text: "Weekly " + variable
        }
    } else {    
        if (since == "since n<sup>th</sup> infected"){
            options.xAxis.title = {
                useHTML: true,
                text: "Days after " + getOrdinary() + " infected"
            }
        } else {
            options.xAxis.type = 'datetime'
            options.xAxis.min = Date.UTC(2020,00,03,0,0,0,0)
        }
    }

    if (variable != 'cases' && variable != 'deaths'){
        options.tooltip.valueDecimals =  2
        options.tooltip.valueSuffix = ' per 100 000'
        options.yAxis.title.text = options.yAxis.title.text + ' per 100 000'
        if (type == '3'){
            options.xAxis.title.text = options.xAxis.title.text + ' per 100 000'
        }
    }

    for (country in countries){
        countryId = countries[country]
        countryData = {
            name: data[countryId].name,
            type: 'spline',
        }
        if (data[countryId].name == 'Brazil'){
            countryData.zIndex = 2
        }
        if (type == '3'){
            daily = getData(data, countryId, 'Daily', variable, "since n<sup>th</sup> infected", 1)
            countryData.data = getData(data, countryId, 'Total', variable, "since n<sup>th</sup> infected", 1).map((v, i)=>[v, daily[i]])
            countryData.data = countryData.data.slice(arrSum(countryData.data.map((v, i)=> v[0] == 0)))
        } else {
            countryData.data = getData(data, countryId, type, variable, since, n)
            if (since != "since n<sup>th</sup> infected"){
                countryData.pointStart= Date.UTC(2020,00,03,0,0,0,0),
                countryData.pointInterval= 3600 * 1000 * 24
            }
        }
        options.series.push(countryData)
    }
    
    chart = Highcharts.chart('chart', options);
    chart.renderer.image('minerva_ufrj.png', 70, 5, 78, 113).add()
    
    return chart
}

function plotMap(){
    type = $('#type').val();
    variable = $('#variable').val();

    title = type.substr(6) + " " + variable;

    subtitle = $('#subtitle').val();
    if (subtitle == ''){
        subtitle = "Data Source: WHO";
    }

    miny = parseInt($('#miny').val());
    if (isNaN(miny)){
        miny = 1;
    }
    maxy = parseInt($('#maxy').val());
    if (isNaN(maxy)){
        maxy = null;
    }

    if (variable == 'cases'){
        seriesName = "Cases"
    } else if (variable == 'deaths'){
        seriesName = "Deaths"
    } else if (variable == 'cases / population'){
        seriesName = "Cases / Population (per 100 000)"
    } else if (variable == 'deaths / population'){
        seriesName = "Deaths / Population (per 100 000)"
    } else {
        seriesName = "Deaths / Cases (per 100 000)"
    }
    mapData = []

    for (i in data){
        if ((typeof(data[i].country_code) !== 'undefined') && (data[i].country_code.length == 3)){
            aux = getData(data, i, type, variable, 'since n<sup>th</sup> infected', 0)
            mapData.push({
                code: data[i].country_code.toUpperCase(), 
                value: aux[aux.length-1] + 1e-16
            })
        }
    }

    chart = Highcharts.mapChart('chart', {
        chart: {
            map: 'custom/world'
        },

        title: {
            useHTML: true,
            text: title
        },

        subtitle:{
            text: subtitle
        },

        mapNavigation: {
            enabled: true
        },

        mapNavigation: {
            enabled: true,
        },

        tooltip:{
            valueDecimals: 0
        },

        colorAxis: {
            min: miny,
            max: maxy,
            type: $('#yType').val()
        },

        series: [{
            data: mapData,
            joinBy: ['iso-a3', 'code'],
            name: seriesName
        }]
    });

    chart.renderer.image('minerva_ufrj.png', 70, 5, 78, 113).add()

    return chart
}

function updateDashboard() {    
    closeNav()

    type = $('#type').val();

    if (type.substr(0, 3) == 'Map'){
        return plotMap();
    } else {
        return plotSeries();
    }
}

