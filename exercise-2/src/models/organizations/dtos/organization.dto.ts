import { Exclude, Expose } from 'class-transformer';

export class OrganizationDto {
  @Exclude()
  id_organization: number;

  @Expose()
  get id(): number {
    return this.id_organization;
  }

  @Expose()
  name: string;

  @Expose()
  status: number;

  constructor(partial: Partial<OrganizationDto>) {
    Object.assign(this, partial);
  }
}
