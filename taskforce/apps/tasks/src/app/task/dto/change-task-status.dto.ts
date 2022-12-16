import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@taskforce/shared-types';
import { IsIn, IsString } from 'class-validator';

export class ChangeTaskStatusDto {
  @ApiProperty({
    description: 'Task new status',
    required: true,
    example: 'cancelled',
  })
  @IsIn(Object.values(TaskStatus))
  public status: TaskStatus;

  @ApiProperty({
    description: 'Task contractor id',
    required: false,
    example: '1282499d-5b42-4007-b103-a8b7f8f51835',
  })
  @IsString()
  public contractor?: string;
}
