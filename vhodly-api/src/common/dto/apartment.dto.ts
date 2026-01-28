import { ApiProperty } from '@nestjs/swagger';

export class ApartmentDto {
  @ApiProperty({ description: 'Apartment number', nullable: true })
  number: number | null;

  @ApiProperty({ description: 'Number of residents', required: false })
  residentsCount?: number;

  @ApiProperty({ description: 'Repairs fee (fixed €2.50)', required: false })
  repairsFee?: number;

  @ApiProperty({ description: 'Current expenses fee', required: false })
  currentExpensesFee?: number;

  @ApiProperty({ description: 'Total debt for the apartment', required: false })
  totalDebt?: number;

  @ApiProperty({ description: 'Last payment date', required: false })
  lastPaymentDate?: string;
}

export class FloorDto {
  @ApiProperty({ description: 'Floor number' })
  number: number;

  @ApiProperty({ description: 'Apartments on this floor', type: [ApartmentDto] })
  apartments: ApartmentDto[];
}
