import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const organization = this.organizationsRepository.create(createOrganizationDto);
    return this.organizationsRepository.save(organization);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.organizationsRepository.findOne({
      where: { id_organization: id },
    });

    if (!organization) {
      throw new NotFoundException('organization not found');
    }

    Object.assign(organization, updateOrganizationDto);
    return this.organizationsRepository.save(organization);
  }

  async list() {
    return this.organizationsRepository.find();
  }

  async delete(id: number) {
    const organization = await this.organizationsRepository.findOne({
      where: { id_organization: id },
    });

    if (!organization) {
      throw new NotFoundException('organization not found');
    }

    await this.organizationsRepository.delete(id);
  }
}
