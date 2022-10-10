import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class OrderPayload {
  @IsString()
  @ApiProperty({ example: 'Donal Trump' })
  readonly name: string;
  @IsString()
  @ApiProperty({ example: 'donaltrump.inwhitehouse@gmail.com' })
  readonly email: string;
  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly quantity: number;
  @IsNumber()
  @ApiProperty({ example: 2.34 })
  readonly price: number;
}
