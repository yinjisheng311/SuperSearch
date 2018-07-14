function is_page_at_google_all_menu() {
    var matchesSnapshot = document.evaluate('//*[@id="hdtb-msb-vis"]/div[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    console.log("snapshot length" + matchesSnapshot.snapshotLength.toString());
    if (matchesSnapshot.snapshotLength == 1) {
        var innerhtml = matchesSnapshot.snapshotItem(0).innerHTML;
        var linkRegex = new RegExp('.*href=.*');
        if (!linkRegex.test(innerhtml)) {
            console.log("This is an ALL page");
            return true;
        } else {
            console.log("This is not the page we are looking for");
            return false
        }
    }
}


function scrape_search_results() {
    // scrape the google search results on the menu
    var matchesSnapshot = document.evaluate('//*[@id="rso"]/div/div/div/div/div/h3', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var links = [];
    for (var i = 0; i < matchesSnapshot.snapshotLength; i++) {
        var match = matchesSnapshot.snapshotItem(i);

        var link = get_link_from_html(match.innerHTML);
        if (link != null) {
            links.push(link);
        }
    }
    return links;
}


function get_link_from_html(innerhtml) {
    // returns the first observed link contained in href='?' in innerhtml
    var regex = /href="([^"]*)"/;
    resultArray = regex.exec(innerhtml);
    //console.log(resultArray);
    if (resultArray == null) {
        return null;
    } else {
        return resultArray['1'];
    }
}


function get_search_query() {
    return document.getElementById('lst-ib').value
}

function open_network_graph(query, data) {
    console.log("sent open network graph");
    var message = {
        type: 'open_network_graph',
        query: query,
        data: data
    }
    chrome.runtime.sendMessage(message);
}


function send_data(query, links) {
    var message = {
        type: 'links',
        query: query,
        links: links,
    };
    console.log(message);
    chrome.runtime.sendMessage(message);


}

var data = null

function recieve_data_callback(data, query) {
    // //render G graphs
    // let testJson = [{
    //     entity_name: 'neural network',
    //     frequency: 445,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.9,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'AlexNet',
    //     frequency: 223,
    //     rel_score: 0.2,
    //     confi_score: 0.8,
    //     overall_score: 0.7,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'ResNet',
    //     frequency: 112,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.6,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'Yann LeCun',
    //     frequency: 45,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.4,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'Andrew',
    //     frequency: 12,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.2,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }];
    updateContent(data, query);

    // return
}

function initialiseGraphs(query) {
    var top_result_bar = document.getElementById("appbar");

    var container_div = document.createElement("div");
    container_div.setAttribute("class", "container");
    container_div.setAttribute("style", "padding-left:150px; display:flex;margin-bottom:1rem;");

    // TOP KEYWORDS DIV
    var top_keywords_div = document.createElement("div");
    top_keywords_div.setAttribute("class", "keywords-container");

    var top_keywords_title = document.createElement("h3");
    top_keywords_title.innerHTML = "Top 5 Relevant Keywords";
    top_keywords_title.setAttribute("style", "font-size:18px;margin-bottom:0;width:fit-content;");
    top_keywords_title.setAttribute("class", "mdl-badge");
    top_keywords_title.setAttribute("id", "tt1");
    top_keywords_title.setAttribute("data-badge", "i");

    // TOOLTIP FOR BADGE
    var tooltip1 = document.createElement("div");
    tooltip1.setAttribute("class", "mdl-tooltip");
    tooltip1.setAttribute("for", "tt1");
    tooltip1.innerHTML = `
    <strong>How did we calculate Relevance?</strong><br>
    We multiplied the relevance score and the confidence score,
    so only the entities with high relevance and confidence score
    will be shown.
    `;

    top_keywords_div.appendChild(top_keywords_title);
    top_keywords_div.appendChild(tooltip1);

    var keywords_table = document.createElement("table");
    keywords_table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    keywords_table.setAttribute("style", "margin-right:5rem;")
    var thead = document.createElement("thead");
    keywords_table.appendChild(thead);
    var tr = document.createElement("tr");
    thead.appendChild(tr);
    var th1 = document.createElement("th");
    th1.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th1.innerHTML = "Keywords";
    tr.appendChild(th1);
    var th2 = document.createElement("th");
    th2.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th2.innerHTML = "Score";
    tr.appendChild(th2);
    top_keywords_div.appendChild(keywords_table);
    container_div.appendChild(top_keywords_div);


    // BARCHART CANVAS INITIALISATION
    var barchart_div = document.createElement("div");
    barchart_div.setAttribute("style", "width:45%; height:100%; margin-right:3rem;");

    var barchart_title = document.createElement("h3");
    barchart_title.innerHTML = "Frequency of Top Keywords";
    barchart_title.setAttribute("style", "font-size:18px;margin-bottom:1rem; width:fit-content;");
    barchart_title.setAttribute("class", "mdl-badge");
    barchart_title.setAttribute("id", "tt2");
    barchart_title.setAttribute("data-badge", "i");
    barchart_div.appendChild(barchart_title);

    // TOOLTIP FOR BADGE
    var tooltip2 = document.createElement("div");
    tooltip2.setAttribute("class", "mdl-tooltip");
    tooltip2.setAttribute("for", "tt2");
    tooltip2.innerHTML = `
    <strong>How did we calculate Frequency?</strong><br>
    We counted the occurrence of each of the top relevant entities.
    `;

    barchart_div.appendChild(barchart_title);
    barchart_div.appendChild(tooltip2);

    var bar_chart_canvas = document.createElement("canvas");
    bar_chart_canvas.setAttribute("id", "barChart");
    bar_chart_canvas.setAttribute("style", "max-height:100% !important; max-width:100% !important;");
    barchart_div.appendChild(bar_chart_canvas);
    container_div.appendChild(barchart_div);


    // GOOGLE TRENDS STUFF
    var trends_div = document.createElement("div");
    trends_div.setAttribute("id", "trends");
    trends_div.setAttribute("style", "width:25%; margin-right:4rem;");
    var trends_title = document.createElement("h3");
    trends_title.innerHTML = "Interest over Time";
    trends_title.setAttribute("style", "font-size:18px;margin-bottom:0rem;width:fit-content;");
    trends_title.setAttribute("class", "mdl-badge");
    trends_title.setAttribute("id", "tt3");
    trends_title.setAttribute("data-badge", "i");

    // TOOLTIP FOR BADGE
    var tooltip3 = document.createElement("div");
    tooltip3.setAttribute("class", "mdl-tooltip");
    tooltip3.setAttribute("for", "tt3");
    tooltip2.innerHTML = `
    <strong>How did we calculate Interest?</strong><br>
    This is an embedded Google Trends API that plots the interest of web search
    of the particular topic against time.
    `;
    trends_div.appendChild(trends_title);
    trends_div.appendChild(tooltip3);

    container_div.appendChild(trends_div);

    // GOOGLE GEO MAP STUFF
    var geo_map_trends_div = document.createElement("div");
    geo_map_trends_div.setAttribute("id", "geo-map-trends");
    geo_map_trends_div.setAttribute("style", "width:25%; margin-right:4rem;");
    var trends_title = document.createElement("h3");
    trends_title.innerHTML = "Interest over Time";
    trends_title.setAttribute("style", "font-size:18px;margin-bottom:0rem;width:fit-content;");
    trends_title.setAttribute("class", "mdl-badge");
    trends_title.setAttribute("id", "tt3");
    trends_title.setAttribute("data-badge", "i");

    // TOOLTIP FOR BADGE
    var tooltip3 = document.createElement("div");
    tooltip3.setAttribute("class", "mdl-tooltip");
    tooltip3.setAttribute("for", "tt3");
    tooltip2.innerHTML = `
    <strong>How did we calculate Interest?</strong><br>
    This is an embedded Google Trends API that plots the interest of web search
    of the particular topic against time.
    `;
    geo_map_trends_div.appendChild(trends_title);
    geo_map_trends_div.appendChild(tooltip3);


    top_result_bar.insertAdjacentElement("afterend", container_div);
    container_div.insertAdjacentElement("afterend", geo_map_trends_div);

    loadScript("https://ssl.gstatic.com/trends_nrtr/1480_RC02/embed_loader.js", function () {
        //initialization code
        var trendScript = document.createElement("script");
        trendScript.type = "text/javascript";
        trendScript.innerHTML = `
        var divElem = document.getElementById('trends');
        trends.embed.renderExploreWidgetTo(divElem, "RELATED_QUERIES", {
            "comparisonItem": [{
                "keyword": " ` + query + `",
                "geo": "",
                "time": "today 12-m"
            }],
            "category": 0,
            "property": ""
        }, {
            "exploreQuery": "q=neural%20network&geo=US&date=today 12-m",
            "guestPath": "https://trends.google.com:443/trends/embed/"
        });
        `;
        container_div.appendChild(trendScript);

        var geoMapScript = document.createElement("script");
        geoMapScript.type = "text/javascript";
        geoMapScript.innerHTML = `
        var divElem = document.getElementById('geo-map-trends');
        trends.embed.renderExploreWidgetTo(divElem, "GEO_MAP", {
            "comparisonItem": [{
                "keyword": " ` + query + `",
                "geo": "",
                "time": "today 12-m"
            }],
            "category": 0,
            "property": ""
        }, {
            "exploreQuery": "q=neural%20network&geo=US&date=today 12-m",
            "guestPath": "https://trends.google.com:443/trends/embed/"
        });
        `;
        container_div.appendChild(geoMapScript);

    });

    // HIDES THE DIV
    var hideContainer_div = document.getElementsByClassName("container");
    hideContainer_div[0].setAttribute("style", "display:none;");

    // LOADING
    var loading_div = document.createElement("div");
    loading_div.setAttribute("style", "width:100%; height:100%; display:flex; align-items:center; justify-content:center;margin-bottom:2rem;");
    loading_div.setAttribute("class", "loading");
    var loading = document.createElement("div");
    loading.setAttribute("class", "mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active");
    loading_div.appendChild(loading);
    top_result_bar.insertAdjacentElement("afterend", loading_div);

    // showMaterialDialog();
}

function showMaterialDialog() {
    var container = document.getElementsByClassName("container");
    var body = document.createElement("body");
    body.innerHTML = `
    <button id="show-dialog" type="button" class="mdl-button">Show Dialog</button>
    <dialog class="mdl-dialog">
      <h4 class="mdl-dialog__title">Allow data collection?</h4>
      <div class="mdl-dialog__content">
        <p>
          Allowing us to collect data will let us get you the information you want faster.
        </p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button">Agree</button>
        <button type="button" class="mdl-button close">Disagree</button>
      </div>
    </dialog>
    `;
    var bodyScript = document.createElement("script");
    bodyScript.innerHTML = `
      var dialog = document.querySelector('dialog');
      var showDialogButton = document.querySelector('#show-dialog');
      if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      showDialogButton.addEventListener('click', function() {
        dialog.showModal();
      });
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });
    `;
    body.appendChild(bodyScript);
    container[0].insertAdjacentElement("afterend", body);

}


function formatJson(json) {
    let labels = [];
    let value = [];
    // COZ TOP 5
    for (let i = 0; i < 5; i++) {
        labels.push(json[i].entity_name);
        value.push(json[i].frequency);
    }
    let labelsString = '"';
    labelsString += labels.join('","');
    labelsString += '"';
    return [labelsString, value];
}


function displayBarChart(json) {
    formattedJson = formatJson(json);
    labels = formattedJson[0];
    value = formattedJson[1];
    var container_div = document.getElementsByClassName("container");

    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var script3 = document.createElement("script");
        script3.innerHTML = `console.log('running bar chart ');
        var ctx = document.getElementById("barChart").getContext('2d');
        Chart.defaults.global.legend.display = false;
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [` + labels + `],
                datasets: [{
                    label: 'Frequency',
                    data: [` + value + `],
                    backgroundColor: [
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    onComplete: function (e) {
                        // console.log(e);
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                          color: 'rgba(0, 0, 0, 0)',
                        },
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (value, index, values) {
                              return '';
                            }
                          }
                      }],
                      yAxes: [{
                        gridLines: {
                          color: 'rgba(0, 0, 0, 0)',
                        },
                        ticks: {
                          beginAtZero: true,
                        }
                      }]
                }
            }
        });`;
        // script3.src = chrome.runtime.getURL("/components/iframe-graph/bar-chart.js");
        container_div[0].insertAdjacentElement("afterend", script3);
    }
}

function updateContent(json, query) {
    // HIDE LOADING
    var loading_div = document.getElementsByClassName("loading");
    loading_div[0].setAttribute("style", "display:none;");

    // UNHIDE CONTAINER
    var hideContainer_div = document.getElementsByClassName("container");
    hideContainer_div[0].setAttribute("style", "padding-left:150px; display:flex;margin-bottom:1rem;");

    // POPUP BUTTON
    var top_result_bar = document.getElementById("appbar");
    var relation_entity_button = document.createElement("button");
    relation_entity_button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised");
    relation_entity_button.innerHTML = "Entity-Relationship Graph";
    relation_entity_button.setAttribute("style", "left:150px");

    // result_stats_bar.insertAdjacentElement("afterend", relation_entity_button);
    relation_entity_button.onclick = function () {
        open_network_graph(query, data);
    };
    top_result_bar.insertAdjacentElement("afterend", relation_entity_button);

    // DETECT GOOGLE TRENDS
    var trends_header = document.getElementsByClassName("embed-header");
    console.log(trends_header);

    console.log(json);
    var keywords_table = document.getElementsByClassName("mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    console.log(keywords_table[0]);

    var tbody = document.createElement("tbody");

    // COZ TOP 5
    for (let i = 0; i < 5; i++) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.setAttribute("class", "mdl-data-table__cell--non-numeric");
        var a = document.createElement("a");
        a.innerHTML = json[i].entity_name;
        a.href = json[i].url;
        a.target = '_blank';
        td.appendChild(a);
        // td.innerHTML = json[i]['entity'];
        tr.appendChild(td);

        var td2 = document.createElement("td");
        td2.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td2.innerHTML = json[i].overall_score.toFixed(2);
        tr.appendChild(td2);

        tbody.appendChild(tr);
    }
    keywords_table[0].appendChild(tbody);

    displayBarChart(json);

}


function main() {
    if (is_page_at_google_all_menu()) {
        var links = scrape_search_results();
        var query = get_search_query();
        console.log(query);
        console.log("List of links ====");
        console.log(links);
        console.log("Query:" + query);

        var search_bar = document.getElementById("hdtb-msb");
        var tell_me_more_button = document.createElement("button");
        tell_me_more_button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised mdl-button--colored");
        tell_me_more_button.innerHTML = "Tell Me More";
        tell_me_more_button.setAttribute("style", "float:right; margin-right:2rem;");

        tell_me_more_button.onclick = function () {
            initialiseGraphs(query);

            // listener to render graphs
            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {
                    console.log(request);
                    if (request.type == 'return_data' && request.query == query) {
                        console.log("GOT RETURN DATA");
                        console.log(request.data);
                        data = request.data;
                        recieve_data_callback(data, query);
                        sendResponse({
                            status: true
                        });
                    }
                    return true;
                }
            );
            send_data(query, links);
        };
        search_bar.insertAdjacentElement("afterend", tell_me_more_button);

    }

}

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {

    loadScript(chrome.runtime.getURL("Chart.js"), function () {
        //initialization code
        console.log('done');
        main();
    });

}