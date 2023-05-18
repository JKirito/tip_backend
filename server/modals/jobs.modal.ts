import {
  prop,
  getModelForClass,
  DocumentType,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';
import User from './user.modal';
import { JobType } from '../interfaces';

@modelOptions({ options: { allowMixed: 0 } })
export default class Job {
  @prop({ ref: () => User })
  public user!: Ref<User>;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public subject!: string;

  @prop({ required: true })
  public location!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true })
  public jobType!: JobType;

  @prop({ ref: () => User, default: [] })
  public applicants!: Ref<User>[];
}

export const JobModal = getModelForClass(Job);
