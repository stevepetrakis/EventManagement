import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { DatabaseModule } from '../db/db.module';

@Module({
    imports: [DatabaseModule],
    controllers: [EventsController],
    providers: [EventsService],
})
export class EventsModule { }