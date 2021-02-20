/* eslint-disable max-len */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const request = require('request');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({
  origin: ['http://localhost:8080', 'https://albumer-cdb7c.web.app', 'https://albumer.site'],
});
const app = express();

// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if (
    (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      'No Firebase ID token was passed in the Authorization header.',
      'Make sure you authorize your request:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    );
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.use(express.json());
app.get('/spotifyToken', (req, res) => {
  console.log(functions.config());
  const auth = `${functions.config().spotify.client_id}:${
    functions.config().spotify.client_secret
  }`;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: 'Basic ' + Buffer.from(auth).toString('base64'),
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const accessToken = body.access_token;
      res.send({
        access_token: accessToken,
      });
    } else {
      console.error(error, response);
    }
  });
});

app.get('/getUsersWithUsername', async (req, res) => {
  const username = req.query.username;
  const found = [];
  const findAllUsers = async nextPageToken => {
    // List batch of users, 1000 at a time.
    await admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then(listUsersResult => {
        listUsersResult.users.forEach(userRecord => {
          const user = userRecord.toJSON();
          if (user.displayName && user.displayName.toLowerCase().includes(username.toLowerCase())) {
            found.push({
              username: user.displayName,
              uid: user.uid,
            });
          }
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          findAllUsers(listUsersResult.pageToken);
        }
        return;
      });
  };
  await findAllUsers();
  res.send({ result: found });
});

app.post('/setUsername', async (req, res) => {
  const body = JSON.parse(req.body);
  const wantedUsername = body.username;
  const uid = body.uid;
  let found = false;
  const findAllUsers = async nextPageToken => {
    // List batch of users, 1000 at a time.
    await admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then(listUsersResult => {
        listUsersResult.users.forEach(userRecord => {
          const user = userRecord.toJSON();
          if (
            user.displayName &&
            user.displayName.toUpperCase().includes(wantedUsername.toUpperCase()) &&
            user.uid != uid
          ) {
            found = true;
            return;
          }
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          findAllUsers(listUsersResult.pageToken);
        }
        return;
      });
  };
  await findAllUsers();
  if (!found) {
    // No one else has that username, OK to use that one
    // All usernames must be uppercase
    admin.auth().updateUser(uid, {
      displayName: wantedUsername,
    });
    res.sendStatus(200);
  } else {
    // Someone else has that username, return error
    res.sendStatus(403);
  }
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);
