import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRouter from './routers/authRouter';
import cors from 'cors';
import mongoose from 'mongoose';

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

app.use('/', authRouter);

if (!PORT) {
  console.error('Failed To Initialize Application, Missing Port');
  process.exit();
}

console.log('Initialized Successfuly');

main().catch((err) => console.error);

var mongoclient;
var mongobucket;
async function main() {
  app.listen(PORT, () => {
    console.log(`Server up at PORT ${PORT}`);
  });

  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/tip`).then((res) => {
      console.log(`Connected to MongoDB successfully`);
      // baseDB.
    });
  } catch (err) {
    console.error(err);
  }
}
