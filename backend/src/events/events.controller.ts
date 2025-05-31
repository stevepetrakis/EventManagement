import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.model';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    findAll(): Promise<Event[]> {
        return this.eventsService.findAll();
    }

    @Get('status/:status')
    async getEventsByStatus(@Param('status') status: string): Promise<Event[]> {
        return this.eventsService.getEventsByStatus(status);
    }

    @Get('count')
    async getCount() {
        return this.eventsService.getCount();
    }
    
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Event> {
        return this.eventsService.getById(id);
    }

    @Post()
    create(@Body() eventData: any) {
        return this.eventsService.create(eventData);
    }
}