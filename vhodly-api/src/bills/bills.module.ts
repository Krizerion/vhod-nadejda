import { Module } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [BillsController],
})
export class BillsModule {}
