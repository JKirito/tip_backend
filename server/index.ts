import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const setup = () => {
  if (!PORT) {
    process.exit();
  }
  console.log('working Successfully');
};

setup();
