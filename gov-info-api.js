// key for google civic api
let authKey = config.civic;

// variables to use for the search
let searchByAddress = "";

// query url to use for api call
let baseQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=" + authKey + "&address=";

// hide results panel at first load
$(document).ready(function() {
    $('#results').hide();
});

// function to return information based on address
function runQuery(search) {
  $.ajax({
    url: search,
    method: "GET"
  }).done(function(res) {

    // console log the result object for error checking
    console.log(res);

    // erase current results if any
    $('#results').empty();

    // for looping through the object and logging all the officials
    for (let i = 0; i < res.officials.length; i++) {

      // binding to hold the official indices position
      let pos = res.offices[i].officialIndices;

      for (let j = 0; j < pos.length; j++) {

        let name = res.officials[pos[j]].name;
        let office = res.offices[i].name;
        let party = "";

        if (res.officials[i].party == "Republican Party" || res.officials[i].party == "Republican") {
          party = "Republican";
        }
        else if (res.officials[i].party == "Democratic Party" || res.officials[i].party == "Democratic") {
          party = "Democratic";
        }

        buildCard(name, office, party);

      }
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

const buildCard = (name, office, party) => {

  let card = `<div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">` + name + `</h5>
                  <h6 class="card-subtitle mb-2 text-muted">` + office + `</h6>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="#" class="card-link">` + party + `</a>
                  </div>
                </div>`;

    // append table data to the panel
    $('#results').append(card);

}
