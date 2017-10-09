var path = require("path");
var fs = require("fs");


// API Routes
// =============================================================

module.exports = function(app) {

	var tripDataArray = [];
	var matchStringify = [];
	var totalDiffArray = [];
	var minNumber;
	// Read the objects array from the trips.js file
	fs.readFile("./app/data/trips.js", "utf8", function(err, data) {

		var trips = JSON.parse(data);
		// Loop through the array of objects and store the data into the tripData object
		for (var i = 0; i < trips.length; i++) {
				tripData = {
					name: trips[i].name,
					description: trips[i].description,
					pic: trips[i].photo,
					score: trips[i].scores
				}
			// Push each of the tripData objects into tripDataArray
			tripDataArray.push(tripData);
		}

		}); // End .readFile

	// Read the trips.js file when /api/trips path is accessed
	app.get("/api/trips", function(req, res) {
		res.sendFile(path.join(__dirname, "../data/trips.js"));
	});
	// Read the match.js file when /api/match path is accessed
	app.get("/api/match", function(req, res) {
		res.sendFile(path.join(__dirname, "../data/match.js"));
	});

	// Post the trip match to the /api/match path 
	app.post("/api/match", function(req, res) {

		var newSurvey = req.body;
		var userScore = [];
		var allTripScores = [];
		var scores = [];
		var count = 0;
		var matchArray = [];

		// Push the scores that the user submitted into the userScore array
		userScore.push(parseInt(newSurvey.q1));
		userScore.push(parseInt(newSurvey.q2));
		userScore.push(parseInt(newSurvey.q3));
		userScore.push(parseInt(newSurvey.q4));
		userScore.push(parseInt(newSurvey.q5));
		userScore.push(parseInt(newSurvey.q6));
		userScore.push(parseInt(newSurvey.q7));
		userScore.push(parseInt(newSurvey.q8));
		userScore.push(parseInt(newSurvey.q9));
		userScore.push(parseInt(newSurvey.q10));
		userScore.push(parseInt(newSurvey.q11));
		userScore.push(parseInt(newSurvey.q12));

		// Print the userScore to the console
    	console.log("User Score: " + userScore);

		// Loop through the tripDataArray (all of our pre-written trip objects) and get each score value
		for (var i = 0; i < tripDataArray.length; i++) {

				var tripScores = {
					tripScore: tripDataArray[i].score
				};
				// Push all of the trip object scores into an array (allTripScores)
				allTripScores.push(tripScores);
			}

		// In order to compare each of our trip scores with the user's scores, 
		// We set a count variable so that it continues to compare each trip with the user's score
		// Every time compareTrips() is run, the count increases, the count is checked, and compareTrips() is called again if the count is less than 33
		// We are using less than 33 because we currently have 33 trips stored in our trips.js file
		function checkCount() { 
			if (count < 33) {
				compareTrips();
			}
		}
		checkCount();

		// compareTrips() compares the user's score with each of the trip scores
		function compareTrips() { 
					var scoreDiffArray = [];
					// We know what trip we are currently comparing because we are setting it's index value as count
					var currentTrip = allTripScores[count];
					console.log("Trip Score: " + currentTrip.tripScore);

					var currentTripScore = currentTrip.tripScore;
					// Now we loop through the currentTripScore and compare it with each of the values in userScore
					for (var i = 0; i < currentTripScore.length; i++) {
						// Loop through each of the values in the userScore
						for (var i = 0; i < userScore.length; i++) {
							// Subtract the cuurentTripScore from the userScore
							var diff = parseInt(userScore[i]) - parseInt(currentTripScore[i]);
							// Push all differences into the scoreDiffArray. Math.abs makes it not a negative number
							scoreDiffArray.push(Math.abs(diff));
						}
						// Now, we get the sum of the differences and store it into an array (totalDiffArray)
						function getSum(total, num) {
				    	return total + num;
						}

						var totalDiff = scoreDiffArray.reduce(getSum);

						totalDiffArray.push(totalDiff);

						count++;
						console.log("Score Diff Array: " + scoreDiffArray);
						console.log("Total Diff: " + totalDiff);
						// Run checkCount again to see if there are more trips to compare with the user's score
						checkCount();
					}
			}


		console.log("Total Differences of All Trips: " + totalDiffArray);
		// Now, we get the smallest number from the totalDiffArray with Math.min. This pulls the smallest difference out of all of the trip differences. 
		// This smallest number is our trip match
		minNumber = Math.min( ...totalDiffArray );
		console.log("Lowest Number: " + minNumber);
		res.json(newSurvey);

		// Loop through the totalDiffArray - we need to figure out which trip had the lowest difference
		for (var i = 0; i < totalDiffArray.length; i++) {
			// If the totalDiffArray is the minNumber
			if(totalDiffArray[i] === minNumber) {
				// Find the index value of that trip's difference. This tells us the position and so we are able to determine which trip it is. 
				var index = totalDiffArray.indexOf(totalDiffArray[i]);
				// This trip is then our trip match
				var match = {
					matchScore: minNumber,
					index: index,
					name: tripDataArray[index].name,
					description: tripDataArray[index].description,
					pic: tripDataArray[index].pic
				}
			}
		}

		matchStringify = JSON.stringify(match);
		console.log("Match: " + matchStringify);
		matchArray.push(match);
			// Write the trip match to our match.js file
			fs.writeFile("./app/data/match.js", JSON.stringify(matchArray, null, 2), function(err) {
				if(err) {
					console.log(err);
				}
			});

	});

}


