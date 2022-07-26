import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { StateRequestEnum } from '../enums/organization.enum';

export class StateValidationPipe implements PipeTransform<string, Promise<StateRequestEnum>> {
  transform(value: string): Promise<StateRequestEnum> {
    if (!isDefined(value) || value in StateRequestEnum) {
      return StateRequestEnum[value];
    } else {
      const errorMessage = `the value ${value} is not valid. See the acceptable values: ${Object.keys(
        StateRequestEnum,
      )}`;
      throw new BadRequestException(errorMessage);
    }
  }
}
