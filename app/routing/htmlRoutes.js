var path = require("path");


// HTML Routes
// =============================================================

module.exports = function(app) {

	app.get("/", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/home.html"));
	});


	app.get("/app/public/survey", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/survey.html"));
	});


}





