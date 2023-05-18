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
  jobType: JobType;
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
  jobType: JobType;
}

export enum Roles {
  ADMIN = 'admin',
  BASIC = 'basic',
}

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  VOLUNTEER = 'volunteer',
  OTHER = 'other',
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  dob: Date;
  phone: string;
  city: string;
  state: string;
  postcode: string;
  education: string;
  preferences: string;
  skills: string;
  coverLetter: string;
  email: string;
  resume: string;
}
