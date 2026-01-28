import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MockDataService } from './mock-data.service';
import { CsvParserService } from '../csv/csv-parser.service';
import { AnnouncementDto, AccountBalancesDto, FloorDto } from '../common/dto';

class LoadDataResponseDto {
  announcements: AnnouncementDto[];
  accountBalances: AccountBalancesDto;
  floors: FloorDto[];
}

@ApiTags('data')
@Controller('api/data')
export class DataController {
  constructor(
    private readonly mockDataService: MockDataService,
    private readonly csvParserService: CsvParserService,
  ) {}

  @Get('load')
  @ApiOperation({
    summary: 'Load all data (announcements, balances, and floors)',
    description: 'Combined endpoint that returns announcements, account balances, and floors data',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all data',
    type: LoadDataResponseDto,
  })
  loadData(): LoadDataResponseDto {
    try {
      return {
        announcements: this.mockDataService.getAnnouncements(),
        accountBalances: this.mockDataService.getAccountBalances(),
        floors: this.csvParserService.parseFloors(),
      };
    } catch (error) {
      throw new HttpException('Failed to load data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
