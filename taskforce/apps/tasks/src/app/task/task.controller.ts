import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { fillObject } from '@taskforce/core';
import { UserRole } from '@taskforce/shared-types';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponse } from './response/task.response';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('task')
  async create(@Body() dto: CreateTaskDto) {
    const customerId = '';
    const newTask = await this.taskService.create(customerId, dto);
    return fillObject(TaskResponse, newTask);
  }

  @Get('task/:id')
  async show(@Param() id: string) {
    const task = await this.taskService.getTask(id);
    return fillObject(TaskResponse, task);
  }

  @Patch('task/:id')
  async update(@Param() id: string, @Body() dto: UpdateTaskDto) {
    const updatedTask = await this.taskService.updateTask(id, dto);
    return fillObject(TaskResponse, updatedTask);
  }

  @Delete('task/:id')
  async deleteTask(@Param() id: string) {
    return this.taskService.deleteTask(id);
  }

  @Get('new')
  async showNew() {
    return fillObject(TaskResponse, this.taskService.findNew());
  }

  @Get('personal')
  async showPersonal() {
    const userId = '';
    const userRole = UserRole.Customer;

    return userRole === UserRole.Customer
      ? fillObject(TaskResponse, this.taskService.findByCustomer(userId))
      : fillObject(TaskResponse, this.taskService.findByContractor(userId));
  }
}