// key for google civic api
let authKey = "AIzaSyDI6y22UiWcVtePvg5EMGB0ifIiV4TKgQ4"

// variables to use for the search
let searchAddress = ""

// query url to use for api call
let baseQueryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=" + authKey + "&address=austin+texas"

// function to return information based on address
function runQuery(queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(repData) {

    console.log(repData)

    for (i = 3; i < repData.offices.length; i++) {
      namePos = repData.offices[i].officialIndices[0]
      console.log(repData.offices[i].name + ": " + repData.officials[namePos].name)
    }

  })
}

runQuery(baseQueryURL)
