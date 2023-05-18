import config from 'config';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  ErrorMessage,
  JobPostData,
  JobsFetchData,
  ProfileData,
  Roles,
} from '../interfaces';
import { isAdmin, validateLoginStatus } from '../utils/routes';
import * as argon2 from 'argon2';
import User, { userModel } from '../modals/user.modal';
import { JobModal } from '../modals/jobs.modal';
import { ProfileModel } from '../modals/profile.modal';
import { post } from '@typegoose/typegoose';

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
  const { username, password, role, adminRefCode, email, firstName, lastName } =
    req.body;
  const result = await userModel.find({ username: username });
  console.log(result);
  if (result.length > 0) {
    res.status(409).json({
      msg: 'Failed to sign up, username already taken',
    });
  } else {
    const hash = await argon2.hash(password);
    console.log(hash);
    const adminCode = config.get<string>('adminrefcode');
    if (role === Roles.ADMIN && adminCode === adminRefCode) {
      const document = await userModel.create({
        username: username,
        password: hash,
        role: Roles.ADMIN,
      });
      const profileDocument = await ProfileModel.create({
        user: document._id,
        email: email,
        username: username,
        firstName: firstName,
        lastName: lastName,
      });
      res.sendStatus(200);
    } else if (role === Roles.ADMIN && adminCode !== adminRefCode) {
      res.status(401).json({
        msg: 'Failed to sign up, invalid admin ref code',
      });
    } else {
      const document = await userModel.create({
        username: username,
        password: hash,
        role: role as Roles,
      });
      res.sendStatus(200);
    }
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

router.get('/profile', validateLoginStatus, async (req, res) => {
  const username: string = res.locals.username;
  const result = await ProfileModel.findOne({ username: username });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({
      msg: 'No profile found',
    });
  }
});

router.post('/profile', validateLoginStatus, async (req, res) => {
  const username: string = res.locals.username;
  const {
    firstName,
    lastName,
    email,
    city,
    coverLetter,
    dob,
    education,
    phone,
    postcode,
    preferences,
    skills,
    state,
    resume,
  } = req.body as ProfileData;
  console.log(resume);
  const result = await ProfileModel.findOneAndUpdate(
    { username: username },
    {
      firstName,
      lastName,
      email,
      city,
      coverLetter,
      dob,
      education,
      phone,
      postcode,
      skills,
      state,
      preferences,
      resume,
    }
  );
  if (result) {
    res.status(200).json(result.populate('resume'));
  } else {
    res.status(404).json({
      msg: 'No profile found',
    });
  }
});

router.post(
  '/quickapply',
  validateLoginStatus,
  async (
    req: Request<{}, {}, { job: JobsFetchData; username: string }>,
    res: Response
  ) => {
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const postuser = await userModel.findOne({
      username: req.body.job.username,
    });
    console.log(req.body.username, user);
    const prevDoc = await JobModal.findOne({
      user: postuser!._id,
      title: req.body.job.title,
    }).populate('applicants');
    console.log(prevDoc);
    const alreadyApplied = prevDoc?.applicants.find((applicant) => {
      // console.log('comparing ', applicant._id, ' and ', user!._id);
      return String(applicant._id) === String(user!._id);
    });
    console.log('alreadyapplied ', alreadyApplied);
    if (alreadyApplied !== undefined) {
      res.status(200).json({
        msg: 'You have already applied to this job',
      });
    } else {
      const doc = await JobModal.findOneAndUpdate(
        { user: postuser!._id, title: req.body.job.title },
        { $push: { applicants: user } }
      );
      console.log(doc);

      res.status(200).json({
        msg: 'Applied successfully',
      });
    }
  }
);

router.post(
  '/deletejob',
  validateLoginStatus,
  async (
    req: Request<{}, {}, { job: JobsFetchData; username: string }>,
    res: Response
  ) => {
    const user = await userModel.findOne({ username: req.body.username });
    const result = await JobModal.findOneAndDelete({
      title: req.body.job.title,
      user: user!._id,
    });
    console.log(result);
    if (result) {
      res.status(200).json({
        msg: 'Job deleted successfully',
      });
    } else {
      res.status(404).json({
        msg: 'Something went wrong, Job not found',
      });
    }
  }
);

router.post(
  '/applicants',
  validateLoginStatus,
  async (
    req: Request<{}, {}, { title: string; username: string }>,
    res: Response
  ) => {
    let user = await userModel.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const result = await JobModal.findOne({
      title: req.body.title,
      user: user!._id,
    }).populate('applicants');
    if (!result) return res.status(404).json({ msg: 'User not found' });
    // const sanitizedOutput = result.applicants.map((applicant) => {
    //   return {
    //     username: applicant._id,
    //   };
    // });

    res.status(200).json(result.applicants);
  }
);

router.get('/admin', validateLoginStatus, isAdmin, async (req, res) => {
  console.log('I am the admin');
  res.status(200).json({
    msg: 'You are authorized admin user',
  });
});

export default router;
