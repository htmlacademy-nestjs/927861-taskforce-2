import { TaskStatus, Category } from '@taskforce/shared-types';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TaskRdo {
  @ApiProperty({
    description: 'Task Id',
    required: true,
    example: 0,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Task title',
    required: true,
    example: 'Need cleaning services',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Task description',
    required: true,
    example: 'Description...',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Task registration date',
    required: true,
    example: 'ISO date',
  })
  @Expose()
  registerDate: string;

  @ApiProperty({
    description: 'Task status',
    required: true,
    example: 'new',
  })
  @Expose()
  status: TaskStatus;

  @ApiProperty({
    description: 'Task category',
    required: true,
    example: '{id: 1, name: "cleaning"}',
  })
  @Expose()
  category: Category;

  @ApiProperty({
    description: 'Task price',
    required: false,
    example: '100',
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Task due date',
    required: false,
    example: '2022-11-29',
  })
  @Expose()
  dueDate: Date;

  @ApiProperty({
    description: 'Task image',
    required: false,
    example: 'MRV11zknpPKDulCtVIUez.jpeg',
  })
  @Expose()
  image: string;

  @ApiProperty({
    description: 'Task address',
    required: false,
    example: 'Neptun',
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: 'Task city',
    required: false,
    example: 'Москва',
  })
  @Expose()
  city: string;

  @ApiProperty({
    description: 'Task tags',
    required: false,
    example: ['tag1', 'tag2'],
  })
  @Expose()
  tags: string[];

  @ApiProperty({
    description: 'Task customer id',
    required: true,
    example: '1282499d-5b42-4007-b103-a8b7f8f51835',
  })
  @Expose()
  customer: string;

  @ApiProperty({
    description: 'Task contractor id',
    required: false,
    example: '1282499d-5b42-4007-b103-a8b7f8f51835',
  })
  @Expose()
  contractor: string;

  @ApiProperty({
    description: 'Number of comments',
    required: true,
    example: 10,
  })
  @Expose({ name: 'comments' })
  @Transform(({ value }) => value.length)
  commentsCount: number;

  @ApiProperty({
    description: 'Number of responses',
    required: true,
    example: 10,
  })
  @Expose({ name: 'responses' })
  @Transform(({ value }) => value.length)
  responsesCount: number;
}
