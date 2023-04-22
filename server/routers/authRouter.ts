import config from 'config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ErrorMessage } from '../interfaces';
import { validateLoginStatus } from '../utils/routes';

const router = express.Router();

router.post('/login', (req, res) => {
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

router.post('/logout', (req, res) => {
  res.sendStatus(200);
});

router.get('/validate', validateLoginStatus, (req, res) => {
  console.log('I am the protected content');
  res.status(200).json({
    msg: 'You are authorized',
    username: res.locals.username,
  });
});

router.get('/protected', (req, res) => {
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

export default router;
