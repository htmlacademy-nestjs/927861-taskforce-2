import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  fillObject,
  GetUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
} from '@taskforce/core';
import { ReviewService } from './review.service';
import { CreateReviewDto, ReviewRdo } from '@taskforce/core';
import { UserRoles } from '@taskforce/shared-types';

@ApiTags('tasks')
@Controller('tasks')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('task/:id/review')
  @ApiOperation({ summary: 'Creates new task review' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiCreatedResponse({
    type: ReviewRdo,
    description: 'Review was successfully created',
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Roles(UserRoles.Customer)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async create(
    @GetUser('id') userId: string,
    @Param('id') taskId: number,
    @Body() dto: CreateReviewDto
  ) {
    const newReview = await this.reviewService.create(taskId, dto, userId);
    return fillObject(ReviewRdo, newReview);
  }
}
