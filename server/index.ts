import express from 'express';
import dotenv from 'dotenv';
import session, { Session } from 'express-session';
import redis, { createClient } from 'redis';
import RedisStore from 'connect-redis';
import bodyParser from 'body-parser';
import {
  BaseUser,
  CustomSessionData,
  TypedRequestBody,
  User,
} from './interfaces';
import cors from 'cors';

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

app.get('/', (req, res) => {
  const session: Session & Partial<CustomSessionData> = req.session;
  if (session.username && session.password) {
    res.send({
      username: session.username,
    });
  } else {
    res.send({
      msg: 'User Not Logged In',
    });
  }
});

app.post('/login', (req, res) => {
  const { password, username } = req.body;
  req.session.user = {
    username,
  };
  res.redirect('/');
  // res.send('success');
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
  });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server up at PORT ${PORT}`);
});
