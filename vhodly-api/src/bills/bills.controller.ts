import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MockDataService } from '../data/mock-data.service';
import { BillDto, TransactionDto } from '../common/dto';

@ApiTags('bills')
@Controller('api/bills')
export class BillsController {
  constructor(private readonly mockDataService: MockDataService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bills' })
  @ApiResponse({
    status: 200,
    description: 'Returns all bills',
    type: [BillDto],
  })
  getBills(): BillDto[] {
    return this.mockDataService.getBills();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific bill by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Bill ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the bill',
    type: BillDto,
  })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  getBillById(@Param('id', ParseIntPipe) id: number): BillDto {
    const bill = this.mockDataService.getBillById(id);
    if (!bill) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return bill;
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get transactions for a specific bill' })
  @ApiParam({ name: 'id', type: 'number', description: 'Bill ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns transactions for the bill',
    type: [TransactionDto],
  })
  getBillTransactions(@Param('id', ParseIntPipe) id: number): TransactionDto[] {
    return this.mockDataService.getTransactionsByBillId(id);
  }
}
