import { DbService } from '../db/db.service';
import { Event } from './event.model';
export declare class EventsService {
    private readonly db;
    constructor(db: DbService);
    findAll(): Promise<Event[]>;
    getById(id: string): Promise<Event>;
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
    create(eventData: any): Promise<any>;
}
