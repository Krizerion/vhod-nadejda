import { Module } from '@nestjs/common';
import { ApartmentsModule } from './apartments/apartments.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AccountsModule } from './accounts/accounts.module';
import { BillsModule } from './bills/bills.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [ApartmentsModule, AnnouncementsModule, AccountsModule, BillsModule, DataModule],
})
export class AppModule {}
