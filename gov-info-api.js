// key for google civic api
let authKey = "AIzaSyDI6y22UiWcVtePvg5EMGB0ifIiV4TKgQ4"

// variables to use for the search
let searchByAddress = ""

// query url to use for api call
let baseQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=" + authKey + "&address="

// counter to give each resulting div a unique identifier
let resultCounter = 1

// function to return information based on address
function runQuery(search) {
  $.ajax({
    url: search,
    method: "GET"
  }).done(function(repData) {

    // console log the result object for error checking
    console.log(repData);

    for (i = 3; i < repData.offices.length; i++) {

      // variable to keep position of person in offices name
      namePos = repData.offices[i].officialIndices[0]
      // console log data for error checking
      console.log(repData.offices[i].name + ": " + repData.officials[namePos].name);

      $('#state-officials-0').append('<h3 id="result"' + resultCounter + '>' + repData.offices[i].name + ": " + repData.officials[namePos].name + '</h3></div>');

      resultCounter++;
    }

  });
}

// click handler for searching
$("#searchBtn").on("click", function() {

  // take the search from user input
  searchByAddress = $("#adSearch").val().trim();

  // combine search address with the base query URL
  queryURL = baseQueryURL + searchByAddress;

  // run the functino to search api
  runQuery(queryURL);

});
