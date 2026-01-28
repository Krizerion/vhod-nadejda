import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
