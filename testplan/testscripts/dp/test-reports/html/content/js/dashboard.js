/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (sec)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 4.166666666666667, "KoPercent": 95.83333333333333};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.041666666666666664, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "fetch_products_data using opstudy filter"], "isController": false}, {"data": [0.0, 500, 1500, "getAdLocationData"], "isController": false}, {"data": [0.0, 500, 1500, "getSeasonCategoryData"], "isController": false}, {"data": [0.0, 500, 1500, "getSegmentData"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_products_data using prod_cat filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_forecast_total_data using product filter"], "isController": false}, {"data": [0.0, 500, 1500, "getEventData"], "isController": false}, {"data": [0.0, 500, 1500, "getTimeData"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_products_data using private_brand filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_forecast_total_data_without_filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_forecast_total_data using prod_cat filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_products_data using product filter"], "isController": false}, {"data": [0.0, 500, 1500, "getVendorData"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "getSeasonData"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_products_data using merchandise_div filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_forecast_total_data using opstudy filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_products_data_without_filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_forecast_total_data using private_brand filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_products_data using brand filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_forecast_total_data using merchandise_div filter"], "isController": false}, {"data": [0.0, 500, 1500, "fetch_forecast_total_data using brand filter"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24, 23, 95.83333333333333, 303.625, 4, 991, 266.0, 426.5, 868.5, 991.0, 1.25997480050399, 0.7296533756824864, 4.506809277876943], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["fetch_products_data using opstudy filter", 1, 1, 100.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.459316037735849, 15.333873820754716], "isController": false}, {"data": ["getAdLocationData", 1, 1, 100.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.7718937125748503, 6.017262350299402], "isController": false}, {"data": ["getSeasonCategoryData", 1, 1, 100.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.4760257633587786, 11.55847447519084], "isController": false}, {"data": ["getSegmentData", 1, 1, 100.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 1.0986328125, 8.525501598011363], "isController": false}, {"data": ["fetch_products_data using prod_cat filter", 1, 1, 100.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.4760257633587786, 15.513179866412212], "isController": false}, {"data": ["fetch_forecast_total_data using product filter", 1, 1, 100.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.4376161710037174, 15.261965613382898], "isController": false}, {"data": ["getEventData", 1, 1, 100.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.2679303278688525, 9.813652663934427], "isController": false}, {"data": ["getTimeData", 1, 1, 100.0, 991.0, 991, 991, 991.0, 991.0, 991.0, 991.0, 1.0090817356205852, 0.3902308274470232, 3.09918169778002], "isController": false}, {"data": ["fetch_products_data using private_brand filter", 2, 2, 100.0, 273.0, 271, 275, 273.0, 275.0, 275.0, 275.0, 1.0834236186348862, 0.4189802275189599, 4.410401713163597], "isController": false}, {"data": ["fetch_forecast_total_data_without_filter", 1, 1, 100.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.459316037735849, 14.198850235849056], "isController": false}, {"data": ["fetch_forecast_total_data using prod_cat filter", 1, 1, 100.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 1.20849609375, 12.8204345703125], "isController": false}, {"data": ["fetch_products_data using product filter", 1, 1, 100.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.4989098837209303, 15.749909156976743], "isController": false}, {"data": ["getVendorData", 1, 1, 100.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.46484375, 11.3525390625], "isController": false}, {"data": ["Debug Sampler", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 1250.9765625, 0.0], "isController": false}, {"data": ["getSeasonData", 1, 1, 100.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.448384831460674, 11.217667368913856], "isController": false}, {"data": ["fetch_products_data using merchandise_div filter", 1, 1, 100.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.4816810344827587, 15.598808668582375], "isController": false}, {"data": ["fetch_forecast_total_data using opstudy filter", 1, 1, 100.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.4760257633587786, 15.639909351145038], "isController": false}, {"data": ["fetch_products_data_without_filter", 1, 1, 100.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.459316037735849, 14.335200471698112], "isController": false}, {"data": ["fetch_forecast_total_data using private_brand filter", 2, 2, 100.0, 270.5, 262, 279, 270.5, 279.0, 279.0, 279.0, 1.0964912280701753, 0.42403371710526316, 4.498933490953947], "isController": false}, {"data": ["fetch_products_data using brand filter", 1, 1, 100.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.4816810344827587, 15.568875718390805], "isController": false}, {"data": ["fetch_forecast_total_data using merchandise_div filter", 1, 1, 100.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.328930412371134, 14.114851804123711], "isController": false}, {"data": ["fetch_forecast_total_data using brand filter", 1, 1, 100.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.4062499999999998, 14.897017045454545], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Average, 4th Column
            case 4:
				item = (item/1000).toFixed(2);
                break;
            // Min, 5th Column
			case 5:
		        item = (item/1000).toFixed(2);
                break;
		    // Max, 6th Column
            case 6:
		        item = (item/1000).toFixed(2);
                break;	
			// Median, 7th Column
            case 7:
				item = (item/1000).toFixed(2);
                break;
            // 90th pct, 8th Column
            case 8:
				item = (item/1000).toFixed(2);
                break;
			// 95th pct, 9th Column
            case 9:
				item = (item/1000).toFixed(2);
               	break;
			// 99th pct, 10th Column
            case 10:
				item = (item/1000).toFixed(2);
				break;
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
               	item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 23, 100.0, 95.83333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24, 23, "400/Bad Request", 23, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["fetch_products_data using opstudy filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getAdLocationData", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getSeasonCategoryData", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getSegmentData", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_products_data using prod_cat filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_forecast_total_data using product filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getEventData", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getTimeData", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_products_data using private_brand filter", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_forecast_total_data_without_filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_forecast_total_data using prod_cat filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_products_data using product filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getVendorData", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["getSeasonData", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_products_data using merchandise_div filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_forecast_total_data using opstudy filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_products_data_without_filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_forecast_total_data using private_brand filter", 2, 2, "400/Bad Request", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_products_data using brand filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_forecast_total_data using merchandise_div filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["fetch_forecast_total_data using brand filter", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
