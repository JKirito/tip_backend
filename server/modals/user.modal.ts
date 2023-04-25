import { prop, getModelForClass } from '@typegoose/typegoose';

export default class User {
  @prop()
  public username!: string;

  @prop()
  public password!: string;
}

export const userModel = getModelForClass(User);
// userModel
