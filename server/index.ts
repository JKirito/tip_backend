import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRouter from './routers/authRouter';
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

// declare module 'express-session' {
//   interface SessionData {
//     user: BaseUser;
//   }
// }

if (!PORT) {
  console.error('Failed To Initialize Application');
  process.exit();
}

console.log('Initialized Successfuly');

app.use('/', authRouter);

app.listen(PORT, () => {
  console.log(`Server up at PORT ${PORT}`);
});
