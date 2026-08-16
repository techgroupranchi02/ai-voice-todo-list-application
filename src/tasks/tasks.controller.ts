import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateVoiceTaskDto } from './dto/create-voice-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Request() req) {
    const userId = req.user.userId;
    const tasks = await this.tasksService.findAll(userId);
    return {
      success: true,
      data: tasks,
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.userId;
    
    try {
      const result = await this.tasksService.create(createTaskDto, userId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error.message === 'Invalid input') {
        return {
          success: false,
          error: {
            code: HttpStatus.BAD_REQUEST,
            message: 'Title cannot be empty.',
          },
        };
      }
      
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const task = await this.tasksService.update(id, updateTaskDto, userId);
    return {
      success: true,
      data: task,
    };
  }

  @Patch(':id/toggle')
  @UseGuards(AuthGuard('jwt'))
  async toggle(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user.userId;
    const task = await this.tasksService.toggle(id, userId);
    return {
      success: true,
      data: task,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const userId = req.user.userId;
    const result = await this.tasksService.remove(id, userId);
    return {
      success: true,
      data: result,
    };
  }

  @Post('voice')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async createFromVoice(@Body() createVoiceTaskDto: CreateVoiceTaskDto, @Request() req) {
    const userId = req.user.userId;
    
    try {
      const result = await this.tasksService.createFromVoice(createVoiceTaskDto, userId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error.message === 'Audio processing error') {
        return {
          success: false,
          error: {
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error processing the audio data.',
          },
        };
      }
      
      throw error;
    }
  }

  @Post('teams/:team_id')
  @UseGuards(AuthGuard('jwt'))
  async createInTeam(
    @Param('team_id', ParseUUIDPipe) teamId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Request() req
  ) {
    const userId = req.user.userId;
    
    try {
      const result = await this.tasksService.createInTeam(createTaskDto, userId, teamId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error.message === 'Invalid input') {
        return {
          success: false,
          error: {
            code: HttpStatus.BAD_REQUEST,
            message: 'Title cannot be empty.',
          },
        };
      }
      
      throw error;
    }
  }
}