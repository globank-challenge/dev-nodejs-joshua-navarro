import { ClassSerializerInterceptor, Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MappingInterceptor } from '../../commons/interceptors/mapping.interceptor';
import { StateValidationPipe } from '../../commons/pipes/state-validation.pipe';
import { OrganizationDetailDto } from './dtos/respository.dto';
import { TribesService } from './tribes.service';

@Controller('tribes')
export class TribesController {
  constructor(private tribesService: TribesService) {}

  @Get('/:tribeId/repositories')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new MappingInterceptor('repositories'))
  async list(
    @Param('tribeId') tribeId: number,
    @Query('fromCoverage') fromCoverage: number,
    @Query('state', StateValidationPipe) state: string,
  ) {
    const repositories = await this.tribesService.listRepositoriesFromTribeId(tribeId, { state, fromCoverage });

    return repositories.map((repository) => new OrganizationDetailDto(repository));
  }
}
