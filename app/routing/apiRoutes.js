var path = require("path");
var fs = require("fs");


// API Routes
// =============================================================

module.exports = function(app) {

	var tripDataArray = [];
	var matchStringify = [];
	var totalDiffArray = [];
	var minNumber;

	fs.readFile("./app/data/trips.js", "utf8", function(err, data) {

		var trips = JSON.parse(data);

		for (var i = 0; i < trips.length; i++) {
				tripData = {
					name: trips[i].name,
					description: trips[i].description,
					pic: trips[i].photo,
					score: trips[i].scores
				}
			tripDataArray.push(tripData);
		}

		}); // End .readFile


	app.get("/api/trips", function(req, res) {
		res.sendFile(path.join(__dirname, "../data/trips.js"));
	});

	app.get("/api/match", function(req, res) {
		res.sendFile(path.join(__dirname, "../data/match.js"));
	});


	app.post("/api/match", function(req, res) {

		var newSurvey = req.body;
		var userScore = [];

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

    	// res.redirect("/app/public/survey"); 
    	console.log("User Score: " + userScore);

		// Get data for all friends
		// Loop through the scores of each friend
		// Subtract the user's score with the friend's score and get a difference
		// Whichever difference is the least, that friend becomes the match


		var allTripScores = [];
		var scores = [];
		var count = 0;
		var matchArray = [];

		for (var i = 0; i < tripDataArray.length; i++) {
				// Loop through the friendDataArray and push all of the friend's scores into an array
				var tripScores = {
					tripScore: tripDataArray[i].score
				};

				// var scores = JSON.stringify(friendScores);
				allTripScores.push(tripScores);
			}

			// Loop through each of the friend's scores and loop through each of the user's scores 
			// Subtract each as we go
		function checkCount() { 
			if (count < 33) {
				compareTrips();
			}
		}
		checkCount();

		function compareTrips() { 
					var scoreDiffArray = [];
					var currentTrip = allTripScores[count];
					console.log("Trip Score: " + currentTrip.tripScore);

					var currentTripScore = currentTrip.tripScore;

					for (var i = 0; i < currentTripScore.length; i++) {

						for (var i = 0; i < userScore.length; i++) {
							var diff = parseInt(userScore[i]) - parseInt(currentTripScore[i]);

							scoreDiffArray.push(Math.abs(diff));
						}

						function getSum(total, num) {
				    	return total + num;
						}

						var totalDiff = scoreDiffArray.reduce(getSum);

						totalDiffArray.push(totalDiff);

						// Make an indexCount for number 1 and indexCount for number 2 
						// Increase indexCount each time the loop goes through
						firstIndexCount = 0;
						secondIndexCount = 1;

						count++;
						console.log("Score Diff Array: " + scoreDiffArray);
						console.log("Total Diff: " + totalDiff);
						checkCount();
					}
		}


		console.log("Total Differences of All Trips: " + totalDiffArray);
		minNumber = Math.min( ...totalDiffArray );
		console.log("Lowest Number: " + minNumber);


		res.json(newSurvey);


		for (var i = 0; i < totalDiffArray.length; i++) {

			if(totalDiffArray[i] === minNumber) {

				var index = totalDiffArray.indexOf(totalDiffArray[i]);

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
			fs.writeFile("./app/data/match.js", JSON.stringify(matchArray, null, 2), function(err) {
				if(err) {
					console.log(err);
				}
			});

	});

}


