import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CsvParserService } from '../csv/csv-parser.service';
import { FloorDto } from '../common/dto';

@ApiTags('apartments')
@Controller('api/apartments')
export class ApartmentsController {
  constructor(private readonly csvParserService: CsvParserService) {}

  @Get('floors')
  @ApiOperation({ summary: 'Get all floors with apartments' })
  @ApiResponse({
    status: 200,
    description: 'Returns all floors with their apartments',
    type: [FloorDto],
  })
  getFloors(): FloorDto[] {
    try {
      return this.csvParserService.parseFloors();
    } catch (error) {
      throw new HttpException('Failed to load floors data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
