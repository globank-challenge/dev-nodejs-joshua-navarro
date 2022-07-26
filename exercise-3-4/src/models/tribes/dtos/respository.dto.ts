import { Expose, Transform } from 'class-transformer';
import { StateApiEnum, StateResponseEnum } from '../../../commons/enums/organization.enum';

export class RepositoryDetailDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  tribe: string;

  @Expose()
  organization: string;

  @Expose()
  @Transform(({ value }) => `${value}%`)
  coverage: string;

  @Expose()
  @Transform(({ value }) => Number.parseInt(value))
  codesmells: string;

  @Expose()
  @Transform(({ value }) => Number.parseInt(value))
  bugs: string;

  @Expose()
  @Transform(({ value }) => Number.parseInt(value))
  vulnerabilities: string;

  @Expose()
  @Transform(({ value }) => Number.parseInt(value))
  hotspots: string;

  @Expose()
  @Transform(({ value }) => StateApiEnum[value])
  verificationState: number;

  @Expose()
  @Transform(({ value }) => StateResponseEnum[value])
  state: string;

  constructor(partial: Partial<RepositoryDetailDto>) {
    Object.assign(this, partial);
  }
}
