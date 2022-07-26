import { ClassSerializerInterceptor, Controller, Get, Param, Query, Res, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Parser } from 'json2csv';
import { MappingInterceptor } from '../../commons/interceptors/mapping.interceptor';
import { StateValidationPipe } from '../../commons/pipes/state-validation.pipe';
import { RepositoryDetailDto } from './dtos/respository.dto';
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

    return repositories.map((repository) => new RepositoryDetailDto(repository));
  }

  @Get('/:tribeId/repositories/export')
  async exportRepositoriesCsv(@Param('tribeId') tribeId: number, @Res({ passthrough: true }) res: any) {
    const repositories = await this.tribesService.listRepositoriesFromTribeId(tribeId, {});

    const repositoriesInstances = repositories.map((repository) => new RepositoryDetailDto(repository));

    const repositoriesDtoData = plainToInstance(RepositoryDetailDto, repositoriesInstances);

    const parser = new Parser();
    const csv = parser.parse(repositoriesDtoData);

    const filename = `repositories-report-tribe-${tribeId}.csv`;

    res.attachment(filename);
    res.set({
      'Content-Type': 'application/csv',
    });

    return csv;
  }
}
