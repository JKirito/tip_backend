import {
  prop,
  getModelForClass,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';
import User from './user.modal';

export default class Profile {
  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop()
  public username!: string;

  @prop()
  public firstName!: string;

  @prop()
  public lastName!: string;

  @prop()
  public dob!: string;

  @prop()
  public email!: string;

  @prop()
  public phone!: string;

  @prop()
  public address!: string;

  @prop()
  public city!: string;

  @prop()
  public state!: string;

  @prop()
  public postcode!: string;

  @prop()
  public education!: string;

  @prop()
  public preferences!: string;

  @prop()
  public skills!: string;

  @prop()
  public coverLetter!: string;

  @prop()
  public resume!: string;
}

export const ProfileModel = getModelForClass(Profile);
