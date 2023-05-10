import {
  prop,
  getModelForClass,
  DocumentType,
  modelOptions,
} from '@typegoose/typegoose';
import { Roles } from '../interfaces';

@modelOptions({ options: { allowMixed: 0 } })
export default class User {
  @prop()
  public username!: string;

  @prop()
  public password!: string;

  @prop({ default: Roles.BASIC })
  public role!: Roles;

  public static async validateUserCredentials(
    this: DocumentType<User>,
    username: string,
    password: string
  ) {}
}

export const userModel = getModelForClass(User);
// userModel
