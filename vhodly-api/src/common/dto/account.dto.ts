import { ApiProperty } from '@nestjs/swagger';

export class AccountBalancesDto {
  @ApiProperty({ description: 'Current expenses balance for 2025' })
  expensesBalance2025: number;

  @ApiProperty({ description: 'Repairs balance for 2025' })
  repairsBalance2025: number;
}
