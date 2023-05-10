import config from 'config';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorMessage, JobPostData } from '../interfaces';
import { isAdmin, validateLoginStatus } from '../utils/routes';
import * as argon2 from 'argon2';
import User, { userModel } from '../modals/user.modal';
import { JobModal } from '../modals/jobs.modal';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { password, username } = req.body;
  const hashkey = config.get<string>('jwthashkey');
  const doc = await userModel.findOne({
    username: username,
  });
  if (!doc) {
    const message: ErrorMessage = {
      msg: 'No Such User Found',
      code: 401,
    };
    res.statusCode = 401;
    res.json(message);
  } else {
    const valid = await argon2.verify(doc.password, password);
    if (valid) {
      const token = jwt.sign({ username }, hashkey, {
        expiresIn: '1h',
      });
      res.json({ token, role: doc.role });
    } else {
      const message: ErrorMessage = {
        msg: 'Invalid credentials',
        code: 401,
      };
      res.statusCode = 401;
      res.json(message);
    }
  }
});

router.post('/logout', (req, res) => {
  res.sendStatus(200);
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const result = await userModel.find({ username: username });
  console.log(result);
  if (result.length > 0) {
    res.status(409).json({
      msg: 'Failed to sign up, username already taken',
    });
  } else {
    const hash = await argon2.hash(password);
    console.log(hash);
    const document = await userModel.create({
      username: username,
      password: hash,
    });
    res.sendStatus(200);
  }
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

router.post(
  '/jobpost',
  validateLoginStatus,
  // isAdmin,
  async (req: Request<{}, {}, JobPostData>, res: Response) => {
    const { description, location, subject, title, jobType } = req.body;
    const user = await userModel.find({
      username: res.locals.username,
    });
    if (!user || !user[0]) res.status(401).send(`Failed to process request`);
    const job = await JobModal.create({
      description,
      location,
      subject,
      title,
      user: user[0]._id,
      jobType,
    });
    console.log(job);
    res.status(200).json({
      job: job,
    });
  }
);

router.get('/jobpost', async (req, res) => {
  const jobs = await JobModal.find({}).populate('user');
  const jobsModified = jobs.map((job) => {
    const { username } = job.user as User;
    return {
      title: job.title,
      subject: job.subject,
      location: job.location,
      description: job.description,
      username: username,
      user_id: job.user._id,
      jobType: job.jobType,
    };
    1;
  });
  res.status(200).json(jobsModified);
});

router.get('/admin', validateLoginStatus, isAdmin, async (req, res) => {
  console.log('I am the admin');
  res.status(200).json({
    msg: 'You are authorized admin user',
  });
});

export default router;
