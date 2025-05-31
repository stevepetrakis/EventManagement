import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  getTest() {
    return { 
      message: 'Backend is working!', 
      timestamp: new Date().toISOString() 
    };
  }

  @Get()
  hello() {
    return {
      message: 'hello'
    }
  }
}