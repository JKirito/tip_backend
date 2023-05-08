import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import Department from './department.modal';

export default class Faculty {
  @prop()
  public fac_id!: string;

  @prop()
  public firstName!: string;

  @prop()
  public lastName!: string;

  @prop()
  public email!: string;

  @prop()
  public phone!: string;

  @prop({ ref: () => Department })
  public department?: [Ref<Department>];
}

export const facultyModel = getModelForClass(Faculty);
