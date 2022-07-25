import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { MappingInterceptor } from '../../commons/interceptors/mapping.interceptor';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationDto } from './dtos/organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationService: OrganizationsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new MappingInterceptor('organization'))
  async create(@Body() body: CreateOrganizationDto) {
    const organization = await this.organizationService.create(body);

    return new OrganizationDto(organization);
  }

  @Patch('/:organizationId')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new MappingInterceptor('organization'))
  async update(@Param('organizationId') organizationId: number, @Body() body: UpdateOrganizationDto) {
    const organization = await this.organizationService.update(organizationId, body);

    return new OrganizationDto(organization);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new MappingInterceptor('organizations'))
  async list() {
    const organizations = await this.organizationService.list();

    return organizations.map((organization) => new OrganizationDto(organization));
  }

  @Delete('/:organizationId')
  @HttpCode(204)
  async delete(@Param('organizationId') organizationId: number) {
    await this.organizationService.delete(organizationId);
  }
}
