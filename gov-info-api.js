// key for google civic api
let authKey = "AIzaSyDI6y22UiWcVtePvg5EMGB0ifIiV4TKgQ4"

// variables to use for the search
let searchByAddress = ""

// query url to use for api call
let baseQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=" + authKey + "&address="

// counter to give each resulting div a unique identifier
let resultCounter = 1

// hide results panel at first load
$(document).ready(function() {
    $('#results').hide();
});

// function to return information based on address
function runQuery(search) {
  $.ajax({
    url: search,
    method: "GET"
  }).done(function(repData) {

    // console log the result object for error checking
    console.log(repData);

    // erase current results if any
    $('#table-area').empty();

    // for looping through the object and logging all the officials
    for (i = 2; i < repData.offices.length; i++) {

      // variable to hold the relevant data
      let namePos = repData.offices[i].officialIndices[0];
      let name = repData.officials[namePos].name;
      let office = repData.offices[i].name;
      // let address = repData.officials[namePos].address[0].line1;
      // let phone = repData.officials[namePos].phones[0];
      let party = "";
      let website = "";
      let imgURL = "";

      // check if the object has urls value and set variable to appropriate data
      if (repData.officials[namePos].urls) {
        website = repData.officials[namePos].urls[0];
      } else {
        website = "N/A";
      }

      // check if object has a photo for the representative, if not give it a placeholder
      if (repData.officials[namePos].photoUrl) {
        imgURL = repData.officials[namePos].photoUrl;
      } else {
        imgURL = "http://placehold.it/100x100"
      }

      // check if object has valid party affiliation for representative, if not give it a placeholder
      if (repData.officials[namePos].party == "Unknown" || repData.officials[namePos].party == undefined) {
        party = "Not Provided"
      } else {
        party = repData.officials[namePos].party;
      }

      // append table data to the panel
      $('#table-area').append('<tr><td><b>' + office + '</b></td><td>' + name + '</td><td>' + party + '</td><td>' + website + '</td></tr>');

      // check if there are multiple officials with the same position, such as the senate
      if (repData.offices[i].officialIndices.length > 1) {
        let addOfficialPos = repData.offices[i].officialIndices[1];
        let addName = repData.officials[addOfficialPos].name;
        let addParty = repData.officials[addOfficialPos].party || "Not Provided";
        let addWebsite = "";

        // check if the additional official has a website
        if (repData.officials[addOfficialPos].urls) {
          addWebsite = repData.officials[addOfficialPos].urls[0];
        } else {
          addWebsite = "N/A";
        }

        // append the additional official
        $('#table-area').append('<tr><td><b>' + office + '</b></td><td>' + addName + '</td><td>' + addParty + '</td><td>' + addWebsite + '</td></tr>');
      }

      resultCounter++;

      // set search input bar to empty
      $('#adSearch').val('');
    }

  });
}

// click handler for searching
$("#searchBtn").on("click", function() {

  // show resuls panel
  $('#results').show();

  // take the search from user input
  searchByAddress = $("#adSearch").val().trim();

  // combine search address with the base query URL
  queryURL = baseQueryURL + searchByAddress;

  // run the function to search api
  runQuery(queryURL);

  return false;

});
