// key for google civic api
let authKey = config.civic;

// variables to use for the search
let searchByAddress = "";

// query url to use for api call
let baseQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=" + authKey + "&address=";

// url for voting location data
let votingLocation = "https://www.googleapis.com/civicinfo/v2/voterinfo?key=" + authKey + "&address="

// function to return representatives based on address
function runQuery(search) {
  $.ajax({
    url: search,
    method: "GET"
  }).done(function(res) {

    console.log(res);

    // erase current results if any
    $('#rep-results').empty();

    // for looping through the object and logging all the officials
    for (let i = 0; i < res.officials.length - 1; i++) {

      // binding to hold the official indices position
      let pos = res.offices[i].officialIndices;

      console.log(pos);

      for (let j = 0; j < pos.length; j++) {

        let name = res.officials[pos[j]].name;
        let office = res.offices[i].name;
        let party = "";
        let photo = res.officials[pos[j]].photoUrl || "https://via.placeholder.com/130x180";

        if (res.officials[i].party == "Republican Party" || res.officials[i].party == "Republican") {
          party = "Republican";
        }
        else if (res.officials[i].party == "Democratic Party" || res.officials[i].party == "Democratic") {
          party = "Democratic";
        }

        buildRepCard(name, office, party, photo);

      }
      // set search input bar to empty
      $('#adSearch').val('');
    }

  });
}

// function to return sample voting locations based on address
function votingQuery(search) {
  $.ajax({
    url: search,
    method: "GET"
  }).fail(function(res) {
    $('#locations-results').empty();
    console.log("Error: " + res.status)
    voteLocationFail();
  })
  .done(function(res) {

    // erase any existing data
    $('#locations-results').empty();
    $('#polling-results').empty();

    // console log the response object for help traversing
    console.log(res);

    // setting to only half the amount of cards that the response object can help create so I can icnlude a "show more >>" button or pagination
    for (let i = 0; i < res.earlyVoteSites.length / 2; i++) {
      let locName = camelCaseMe(res.earlyVoteSites[i].address.locationName);
      let locAddress = res.earlyVoteSites[i].address.line1;
      let locCity = res.earlyVoteSites[i].address.city;
      let locState = res.earlyVoteSites[i].address.state;
      let locZip = res.earlyVoteSites[i].address.zip;
      let locStart = res.earlyVoteSites[i].startDate;
      let locEnd = res.earlyVoteSites[i].endDate;

      buildVoteLocation(locName, locAddress, locCity, locState, locZip, locStart, locEnd);
    }

    // setting to only 6 cards at the moment so I can icnlude a "show more >>" button or pagination
    for (let j = 0; j < 6; j++) {
      let pollName = res.pollingLocations[j].address.locationName;
      let pollAddress = res.pollingLocations[j].address.line1;
      let pollCity = res.pollingLocations[j].address.city;
      let pollState = res.pollingLocations[j].address.state;
      let pollZip = res.pollingLocations[j].address.zip;
      let pollHours = res.pollingLocations[j].pollingHours;

      buildPollingLocation(pollName, pollAddress, pollCity, pollState, pollZip, pollHours);
    }

  });
}

// click handler for searching
$("#searchBtn").on("click", function() {

  // take the search from user input
  searchByAddress = $("#adSearch").val().trim();

  // combine search address with the base query URL
  queryURL = baseQueryURL + searchByAddress;

  //combine search address with voting location address


  // call the function to find representatives
  runQuery(queryURL);
  votingQuery(votingLocation + searchByAddress);

  return false;

});


// function to build representative card
const buildRepCard = (name, office, party, photo) => {

  let card = `<div class="card shadow mb-3" style="width: 520px;">
                <div class="row no-gutters">
                  <div class="col-md-3">
                    <img src="` + photo + `" class="card-img" alt="..." style="height: 100%;">
                  </div>
                  <div class="col-md-9">
                    <div class="card-body">
                    <h5 class="card-title">` + name + `</h5>
                    <p class="card-text">` + office + `</p>
                    <p class="card-text">` + party + `</p>
                    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                  </div>
                </div>
              </div>
            </div>`;

    // append the representative card
    $('#rep-results').append(card);
};

// function to build location card
const buildVoteLocation = (name, address, city, state, zip, start, end) => {

  let location = `<div class="card shadow" style="width: 21rem; height 50rem;">
                    <div class="card-body d-flex align-items-start flex-column">
                      <div>
                        <h5 class="card-title">` + name + `</h5>
                      </div>
                      <div class="mt-auto">
                        <h6 class="card-subtitle mb-2 text-muted">` + address + `</h6>
                        <h6 class="card-subtitle mb-2 text-muted">` + city + `, ` + state + ` ` + zip + `</h6>
                        <div class="mb-2">
                          <p class="card-text"><strong>Start:</strong> ` + start + `</p>
                          <p class="card-text"><strong>End:</strong> ` + end + `</p>
                        </div>
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                      </div>
                    </div>
                  </div>`;

  // append the location card
  $('#locations-results').append(location);
};

// function to build polling card
const buildPollingLocation = (name, address, city, state, zip, hours) => {

  let location = `<div class="card shadow" style="width: 21rem; height 50rem;">
                    <div class="card-body d-flex align-items-start flex-column">
                      <div>
                        <h5 class="card-title">` + name + `</h5>
                      </div>
                      <div class="mt-auto">
                        <h6 class="card-subtitle mb-2 text-muted">` + address + `</h6>
                        <h6 class="card-subtitle mb-2 text-muted">` + city + `, ` + state + ` ` + zip + `</h6>
                        <div class="mb-2">
                          <p class="card-text"><strong>Start:</strong> ` + hours + `</p>
                        </div>
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                      </div>
                    </div>
                  </div>`;

  // append the location card
  $('#polling-results').append(location);
};

// function to build placeholder on fail
const voteLocationFail = () => {

  let failMessage = `<div class="card text-center w-100 alert alert-danger">
                      <div class="card-body">
                        <h5 class="card-title">No Upcoming Elections</h5>
                        <p class="card-text">No state or national elections are set to take place in the near future.</p>
                      </div>
                     </div>`;

  $("#locations-results").append(failMessage);

};



// function to turn string into camel case
const camelCaseMe = (str) => {

  // first set string to all lowercase
  let strings = str.toLowerCase();
  let string = "";

  // now break it into an array of sub-strings based on whitespace
  strings = strings.split(" ");

  // loop through array of strings and convert first letter to uppercase
  for (let i = 0; i < strings.length; i++) {
    string = strings[i];
    string = string.split("");
    string[0] = string[0].toUpperCase();
    string = string.join("");
    strings[i] = string;
  }

  // join array of camel case strings into one string
  strings = strings.join(" ");

  return strings;

};

const upperMe = (str) => {
  return str.charAt(0).toUpperCase;
}

// call function on page load to populate content
runQuery(baseQueryURL + "615 Red River St, Austin, TX 78701");
votingQuery(votingLocation + "615 Red River St, Austin, TX 78701");
