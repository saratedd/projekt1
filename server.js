const express = require("express")
const { auth } = require('express-openid-connect');
require('dotenv').config()
const data = require('./data.json')
const comments = require('./comments.json');
const res = require("express/lib/response");
var fs = require('fs');
// require('./index')

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER
};

const attributes = ['Date', 'Home', 'Away', 'Home goals', 'Away goals']

const app = express()

app.set('view engine', 'ejs')
app.use(express.static(__dirname)); // to serve static files
app.use(auth(config));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.status(200)
    // console.log(data[0])

    if (req.oidc.isAuthenticated()) {
        user = req.oidc.user
        role = user.sid == 'e2PH5dgKsEwk7TnSfeGh5yMruD4Uorls' ? 'admin' : 'user'
        user = user.nickname
    } else {
        user = 'Anonymous'
        role = 'anonymous'   
    }
    
    res.render('index', {
        text: 'world',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: user,
        role: role,
        attrs: attributes,
        data: data,
        comments: comments
    })
})

app.post("/add", (req, res) => {
    if (req.oidc.isAuthenticated()) {
        user = req.oidc.user
        role = user.sid == 'e2PH5dgKsEwk7TnSfeGh5yMruD4Uorls' ? 'admin' : 'user'
        user = user.nickname
    } else {
        user = 'Anonymous'
        role = 'anonymous'   
    }
    var author = user
    var date = new Date()
    date = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
    var text = req.body.comment
    if (text == '') {
        res.render('index', {
            text: 'world',
            isAuthenticated: req.oidc.isAuthenticated(),
            user: user,
            role: role,
            attrs: attributes,
            data: data,
            comments: comments
        })
    } else {
        var commentsData = fs.readFileSync('./comments.json') // raw
        var commentsDataJson = JSON.parse(commentsData) // json
        var obj = {
            "id": commentsDataJson[commentsDataJson.length - 1].id + 1,
            "author" : author,
            "date": date,
            "text": text
        }
        // napraviti if ako je comments.json empty
        var newData = JSON.stringify(commentsDataJson).substring(0, JSON.stringify(commentsDataJson).length - 1)
            + ','
            + JSON.stringify(obj)
            + ']'

        fs.writeFileSync('./comments.json', newData);

        res.render('index', {
            text: 'world',
            isAuthenticated: req.oidc.isAuthenticated(),
            user: user,
            role: role,
            attrs: attributes,
            data: data,
            comments: JSON.parse(newData)
        })
    }
})

app.post("/delete", (req, res) => {
    if (req.oidc.isAuthenticated()) {
        user = req.oidc.user
        role = user.sid == 'e2PH5dgKsEwk7TnSfeGh5yMruD4Uorls' ? 'admin' : 'user'
        user = user.nickname
    } else {
        user = 'Anonymous'
        role = 'anonymous'   
    }
    var id = req.body.delete
    var commentsData = fs.readFileSync('./comments.json') // raw
    var commentsDataJson = JSON.parse(commentsData) // json
    console.log(commentsDataJson);
    for (comm in commentsDataJson) {
        if (commentsDataJson[comm].id == id) {
            commentsDataJson.splice(comm, 1)
            break
        }
    }
    var newData = commentsDataJson
    fs.writeFileSync('./comments.json', JSON.stringify(newData));
    console.log(commentsDataJson);
    res.render('index', {
        text: 'world',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: user,
        role: role,
        attrs: attributes,
        data: data,
        comments: newData
    })
})

app.post('/update', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        user = req.oidc.user
        role = user.sid == 'e2PH5dgKsEwk7TnSfeGh5yMruD4Uorls' ? 'admin' : 'user'
        user = user.nickname
    } else {
        user = 'Anonymous'
        role = 'anonymous'   
    }

    console.log(req.body);
    var id = req.body.update
    var newText = req.body.comment
    var commentsData = fs.readFileSync('./comments.json') // raw
    var commentsDataJson = JSON.parse(commentsData) // json
    console.log(commentsDataJson);
    for (comm in commentsDataJson) {
        if (commentsDataJson[comm].id == id) {
            // console.log(commentsDataJson[comm].text);
            commentsDataJson[comm].text = newText
            break
        }
    }
    var newData = commentsDataJson
    fs.writeFileSync('./comments.json', JSON.stringify(newData));
    console.log(commentsDataJson);
    res.render('index', {
        text: 'world',
        isAuthenticated: req.oidc.isAuthenticated(),
        user: user,
        role: role,
        attrs: attributes,
        data: data,
        comments: newData
    })

})

app.get("/:smth", (req, res) => {
    res.status(404).send(`This page (localhost:3000/${req.params.smth}) does not exist. Go somewhere else.`)
})

app.listen(process.env.PORT || 3000)