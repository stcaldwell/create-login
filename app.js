const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const data = require('./userData.js')
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
  secret: 'talking parrot',
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next){
  var views = req.session.views;

  next()
});

function authenticate(req, username, password){
  var authenticatedUser = data.users.find(function (user) {
    if (username === user.username && password === user.password) {
      req.session.authenticated = true;
      console.log('User & Password Authenticated');
    } else {
      return false;
    }
  })
  };



app.get('/', function (req, res){
  if (req.session && req.session.authenticated) {
    res.render('index');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res){
    res.render('login');
  })
// })

app.post('/', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  authenticate(req, username, password);
  if (req.session && req.session.authenticated) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});


app.listen(3000, function(){
  console.log('It has begun!')
});
