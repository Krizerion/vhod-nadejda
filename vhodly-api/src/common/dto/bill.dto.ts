import { ApiProperty } from '@nestjs/swagger';

export class BillDto {
  @ApiProperty({ description: 'Bill ID' })
  id: number;

  @ApiProperty({ description: 'Bill type (e.g., "Електричество", "Вода")' })
  type: string;

  @ApiProperty({ description: 'Bill amount', nullable: true })
  amount: number | null;

  @ApiProperty({ description: 'Whether the bill is paid' })
  paid: boolean;

  @ApiProperty({ description: 'Payment date (DD-MMM-YYYY format)', nullable: true })
  paidDate?: string | null;

  @ApiProperty({ description: 'Bill description', required: false })
  description?: string;
}
