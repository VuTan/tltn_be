import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('week')
  async getStatsByWeek() {
    const stats = await this.statsService.getStatsByWeek();
    return stats;
  }

  @Get('month')
  async getStatsByMonth() {
    const stats = await this.statsService.getStatsByMonth();
    return stats;
  }

  @Get('year')
  async getStatsByYear() {
    const stats = await this.statsService.getStatsByYear();
    return stats;
  }
}
