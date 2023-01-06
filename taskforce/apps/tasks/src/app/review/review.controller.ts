import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { fillObject } from '@taskforce/core';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRdo } from './rdo/review.rdo';

@ApiTags('tasks')
@Controller('tasks')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('review')
  @ApiResponse({
    type: ReviewRdo,
    status: HttpStatus.CREATED,
    description: 'Review was successfully created',
  }) // TODO: move taskId to param?
  async create(@Body() dto: CreateReviewDto) {
    const customerId = '123'; //TODO: temporary
    const newReview = await this.reviewService.create(dto, customerId);
    return fillObject(ReviewRdo, newReview);
  }
}