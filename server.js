const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

const apiKey = "36cf96d5b76bdafa58579914ab631a00";

// Allows connection to the CSS file
app.use(express.static("public"));
// Accesses bodyParser parser and allows us to access the name of the city the user typed
app.use(bodyParser.urlencoded({ extended: true }));
// Sets the template engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index", { weather: null, error: null });
});
// post request that logs the value of 'city' to the console
app.post("/", (req, res) => {
	const zipCode = req.body.zipCode;
	const units = "imperial";
	const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=Metric&appid=${apiKey}&units=${units}`;

	request(url, function (err, response, data) {
		if (err) {
			res.render("index", { weather: null, error: "Error, please try again" });
		} else {
			let weather = JSON.parse(data);

			if (weather.main == undefined) {
				res.render("index", {
					weather: null,
					error: "Error, please try again",
				});
			} else {
				let icon = weather.weather[0].icon;
				let imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
				let weatherText = `It's ${weather.main.temp} degrees celsius in ${weather.name} & it is ${weather.weather[0].description}!`;
				res.render("index", {
					weather: weatherText,
					icon: imgURL,
					error: null,
				});
			}
		}
	});
});

app.listen(process.env.PORT || 3000, function () {
	console.log("running on port 3000");
});
