import { Module } from '@nestjs/common';
import { MockDataService } from './mock-data.service';
import { DataController } from './data.controller';
import { CsvModule } from '../csv/csv.module';

@Module({
  imports: [CsvModule],
  providers: [MockDataService],
  controllers: [DataController],
  exports: [MockDataService],
})
export class DataModule {}
