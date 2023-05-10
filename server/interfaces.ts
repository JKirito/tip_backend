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
export interface JobPostData {
  title: string;
  subject: string;
  location: string;
  description: string;
}

export interface ErrorMessage {
  msg: string;
  code: number;
}
export interface TokenData {
  token: string;
}

export interface JobsFetchData {
  title: string;
  subject: string;
  location: string;
  description: string;
  user_id: string;
  username: string;
}
