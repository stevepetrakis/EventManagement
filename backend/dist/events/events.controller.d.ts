import { EventsService } from './events.service';
import { Event } from './event.model';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(): Promise<Event[]>;
    getEventsByStatus(status: string): Promise<Event[]>;
    getCount(): Promise<{
        success: boolean;
        count: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        count: number;
    }>;
    findOne(id: string): Promise<Event>;
    create(eventData: any): Promise<any>;
}
