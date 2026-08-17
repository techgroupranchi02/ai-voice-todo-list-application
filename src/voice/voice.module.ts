import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';
import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [VoiceController],
  providers: [VoiceService],
  exports: [VoiceService],
})
export class VoiceModule {}