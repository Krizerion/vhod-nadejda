import { Controller, Get, Param, ParseEnumPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MockDataService } from '../data/mock-data.service';
import { AccountBalancesDto, TransactionDto } from '../common/dto';
import { AccountType } from '../common/enums/account-type.enum';

@ApiTags('accounts')
@Controller('api/accounts')
export class AccountsController {
  constructor(private readonly mockDataService: MockDataService) {}

  @Get('balances')
  @ApiOperation({ summary: 'Get account balances' })
  @ApiResponse({
    status: 200,
    description: 'Returns account balances',
    type: AccountBalancesDto,
  })
  getBalances(): AccountBalancesDto {
    return this.mockDataService.getAccountBalances();
  }

  @Get(':type/transactions')
  @ApiOperation({ summary: 'Get transactions for a specific account type' })
  @ApiParam({
    name: 'type',
    enum: AccountType,
    description: 'Account type',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns transactions for the account type',
    type: [TransactionDto],
  })
  getTransactions(
    @Param('type', new ParseEnumPipe(AccountType))
    type: AccountType,
  ): TransactionDto[] {
    return this.mockDataService.getTransactionsByAccountType(type);
  }
}
