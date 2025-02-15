import { IsNumberString } from 'class-validator';

export class Params {
  @IsNumberString()
  id: string;
}
