require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.use(express.static('public'));

const generateState = () => {
    return crypto.randomBytes(16).toString('hex');
}

let state;

app.get('/login', (req, res) => {
    state = generateState();
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/auth&response_type=code&state=${state}`;
    res.redirect(authUrl);
});

app.get('/auth', (req, res) => {
    const { code, state: returnedState } = req.query;

    if (!code || !returnedState) {
        return res.status(400).send('Code or state missing');
    }

    if (returnedState !== state) {
        return res.status(403).send('Invalid state');
    }

    axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: 'http://localhost:3000/auth'
    }).then(response => {
        const token = response.data.access_token;
        res.redirect(`/welcome?token=${token}`);
    }).catch(error => {
        console.error('Error exchanging token:', error);
        return res.status(500).send('Authentication failed');
    });
});

app.get('/welcome', (req, res) => {
    const token = req.query.token;
    res.send(`<h1>Welcome</h1><p>Your access token is: ${token}</p>`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
