import { prop, getModelForClass } from '@typegoose/typegoose';

export default class Unit {
  @prop()
  public name!: string;

  @prop()
  public code!: string;

  @prop()
  public type!: string;

  @prop()
  public course!: [string];
}

export const unitModel = getModelForClass(Unit);
