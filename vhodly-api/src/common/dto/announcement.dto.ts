import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementDto {
  @ApiProperty({ description: 'Announcement ID' })
  id: number;

  @ApiProperty({ description: 'Announcement message' })
  message: string;

  @ApiProperty({ description: 'Announcement date', required: false })
  date?: string;

  @ApiProperty({ description: 'Icon name for the announcement' })
  icon: string;
}
