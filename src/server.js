const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express();
const port = 3000;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  console.log(accessToken, refreshToken, profile);

  // Todo - verify user against database ?
  done(null, profile);
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/fail' }),
  (req, res) => {
    res.redirect('/login/sucess');
  });

app.get('/login/fail', (req, res) => {
  res.send('Login Failed');
});


app.get('/login/sucess', (req, res) => {
  res.send('Login sucess');
});

app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});
