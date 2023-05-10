import {
  prop,
  getModelForClass,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';
import User from './user.modal';

export default class Job {
  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop()
  public title!: string;

  @prop()
  public subject!: string;

  @prop()
  public location!: string;

  @prop()
  public description!: string;
}

export const JobModal = getModelForClass(Job);
