import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsEmail } from 'class-validator';
export class OrderPayload {
  @IsString({
    message: 'Name must is string',
  })
  @ApiProperty({ example: 'Donal Trump' })
  readonly name: string;

  @IsString({ message: 'Email must is string' })
  @IsEmail({ message: 'Email is invalid' })
  @ApiProperty({ example: 'donaltrump.inwhitehouse@gmail.com' })
  readonly email: string;

  @IsNumber()
  @Min(0, { message: 'Quantity must greater than 0' })
  @ApiProperty({ example: 1 })
  readonly quantity: number;

  @IsNumber()
  @Min(0, { message: 'Price must greater than 0' })
  @ApiProperty({ example: 2.34 })
  readonly price: number;
}
