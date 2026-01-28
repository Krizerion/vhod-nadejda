import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MockDataService } from '../data/mock-data.service';
import { AnnouncementDto } from '../common/dto';

@ApiTags('announcements')
@Controller('api/announcements')
export class AnnouncementsController {
  constructor(private readonly mockDataService: MockDataService) {}

  @Get()
  @ApiOperation({ summary: 'Get all announcements' })
  @ApiResponse({
    status: 200,
    description: 'Returns all announcements',
    type: [AnnouncementDto],
  })
  getAnnouncements(): AnnouncementDto[] {
    return this.mockDataService.getAnnouncements();
  }
}
