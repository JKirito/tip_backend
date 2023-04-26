import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';

export default class User {
  @prop()
  public username!: string;

  @prop()
  public password!: string;

  public static async validateUserCredentials(
    this: DocumentType<User>,
    username: string,
    password: string
  ) {}
}

export const userModel = getModelForClass(User);
// userModel
