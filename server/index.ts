import express from 'express';
import dotenv from 'dotenv';
import session, { Session } from 'express-session';
import redis, { createClient } from 'redis';
import RedisStore from 'connect-redis';
import bodyParser from 'body-parser';
import {
  BaseUser,
  CustomSessionData,
  ErrorMessage,
  TypedRequestBody,
  User,
} from './interfaces';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { validateLoginStatus } from './utils/routes';
import config from 'config';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  cors({
    origin: '*',
  })
);

let redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});
redisClient
  .connect()
  .then(() => {
    console.log('Connected to Redis');
  })
  .catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: 'u_',
});

declare module 'express-session' {
  interface SessionData {
    user: BaseUser;
  }
}

app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: 'root',
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

if (!PORT) {
  console.error('Failed To Initialize Application');
  process.exit();
}

console.log('Initialized Successfuly');

app.get('/validate', validateLoginStatus, (req, res) => {
  console.log('I am the protected content');
  res.status(200).json({
    msg: 'You are authorized',
    username: res.locals.username,
  });
});

app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const msg: ErrorMessage = {
      code: 401,
      msg: 'authorization header not found',
    };
    res.status(401).json(msg);
  }
  console.log(authHeader);
});

app.post('/login', (req, res) => {
  const { password, username } = req.body;
  const hashkey = config.get<string>('jwthashkey');
  if (username === password) {
    const token = jwt.sign({ username }, hashkey, {
      expiresIn: '1h',
    });
    res.json({ token });
  } else {
    const message: ErrorMessage = {
      msg: 'Invalid credentials',
      code: 401,
    };
    res.statusCode = 401;
    res.json(message);
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
  });
  // res.redirect('/');
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server up at PORT ${PORT}`);
});
