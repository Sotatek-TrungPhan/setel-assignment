import { ApiProperty } from '@nestjs/swagger';

export class OrderPayload {
  @ApiProperty({ example: 'Donal Trump' }) readonly name: string;
  @ApiProperty({ example: 'donaltrump.inwhitehouse@gmail.com' })
  readonly email: string;
  @ApiProperty({ example: 1 }) readonly quantity: number;
  @ApiProperty({ example: 2.34 }) readonly price: number;
}
