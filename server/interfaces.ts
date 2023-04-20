export interface CustomSessionData {
  username: string;
  password: string;
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface User {}
export interface BaseUser {
  username: string;
}

export interface ErrorMessage {
  msg: string;
  code: number;
}
export interface TokenData {
  token: string;
}
