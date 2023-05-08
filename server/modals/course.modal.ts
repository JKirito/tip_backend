import { prop, getModelForClass } from '@typegoose/typegoose';

export default class Course {
  @prop()
  public code!: string;

  @prop()
  public name!: string;

  @prop()
  public description!: string;

  @prop()
  public department!: string;

  @prop()
  public credit?: string;

  @prop()
  public syllabus?: string;
}

export const courseModel = getModelForClass(Course);
