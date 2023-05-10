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
}

export const ProfileModel = getModelForClass(Profile);
