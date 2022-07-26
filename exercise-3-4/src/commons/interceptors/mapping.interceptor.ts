import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MappingInterceptor implements NestInterceptor {
  constructor(private entityName: string) {}

  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(map((data: any) => ({ [this.entityName]: data })));
  }
}
