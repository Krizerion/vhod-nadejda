import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { CsvModule } from '../csv/csv.module';

@Module({
  imports: [CsvModule],
  controllers: [ApartmentsController],
})
export class ApartmentsModule {}
