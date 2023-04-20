import { NextFunction, Request, Response } from 'express';
import { ErrorMessage } from '../interfaces';
import jwt from 'jsonwebtoken';
import config from 'config';

export const validateLoginStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const message: ErrorMessage = {
      code: 401,
      msg: 'authorization header missing',
    };
    console.log(message);
    res.status(401).send(message);
  } else {
    const token = authHeader.split(' ')[1];
    try {
      const hashkey = config.get<string>('jwthashkey');
      const decoded = jwt.verify(token, hashkey);
      console.log('You are authorized to view this content');
      next();
    } catch (err) {
      console.log('You are not authorized');
      console.error(err);
      const msg: ErrorMessage = {
        code: 401,
        msg: 'Not Authorized',
      };
      res.status(401).json(msg);
    }
  }
};
