import { Module } from '@nestjs/common';
import { TaskMemoryRepository } from './repository/task-memory.repository';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskMemoryRepository, TaskService]
})
export class TaskModule {}