import { prop, getModelForClass } from '@typegoose/typegoose';

export default class Department {
  @prop()
  public code!: string;

  @prop()
  public name!: string;

  @prop()
  public description?: string;

  @prop()
  public chairperson?: string;

  @prop()
  public faculty?: [string];
}

export const departmentModel = getModelForClass(Department);
