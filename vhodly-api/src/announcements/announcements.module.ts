import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}
