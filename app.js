const axios = require('axios');
const express = require('express');
const app = express();
const expressip = require('express-ip');
const PORT = process.env.PORT || 5000;
const path = require('path');

const handlebars = require('express-handlebars');

app.engine('.hbs', handlebars({ extname: '.hbs' }));

app.set("PORT", PORT);

app.use(expressip().getIpInfoMiddleware);

app.use(express.static(path.join(__dirname, 'assets')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.get('/', function (req, res) {
    let url = `https://indreed.herokuapp.com/api/jobs`;
    axios({
        method: 'get',
        url
    })
    .then(function (response) {
        let jobs = response.data;
        res.render("main", { title: "Jobready", jobs: jobs});
    })
    .catch(function (error) {
        console.log(error);
    });

});

app.get('/search', function (req, res) {
    const queries = req.query;
    var ipInfo = req.ipInfo
    if (ipInfo.country) {
        let url = `https://indreed.herokuapp.com/api/jobs?country=${ipInfo.country}`;
    } else {
        let url = `https://indreed.herokuapp.com/api/jobs`;
    }

    if (queries){
        axios.get(url, {
        params: queries
    })
    .then(function(response){
        res.render("search", { title: "Jobready", jobs: response.data, countryCode: ipInfo.country});

    })
    .catch(function(error) {
        console.log(error);
    });
    }
    else {
        res.render("search", {title: "Jobready"})
    }
});



app.listen(app.get('PORT'), function () {
    console.log('Express started on http://localhost:' +
        app.get('PORT') + '; press Ctrl-C to terminate.');
});