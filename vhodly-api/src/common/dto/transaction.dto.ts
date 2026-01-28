import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: number;

  @ApiProperty({ description: 'Associated bill ID', required: false })
  billId?: number;

  @ApiProperty({
    description: 'Account type',
    enum: ['currentExpenses', 'repairs'],
    required: false,
  })
  accountType?: 'currentExpenses' | 'repairs';

  @ApiProperty({ description: 'Transaction type', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ description: 'Transaction date (DD-MMM-YYYY format)' })
  date: string;

  @ApiProperty({ description: 'Transaction description' })
  description: string;
}
