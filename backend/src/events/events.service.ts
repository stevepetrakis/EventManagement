import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Event } from './event.model';

@Injectable()
export class EventsService {
    constructor(private readonly db: DbService) { }

    async findAll(): Promise<Event[]> {
       const query = `
            SELECT 
                e.event_id,
                e.title,
                e.game_type,
                e.category,
                e.status,
                e.is_popular,
                e.viewers,
                e.image,
                e.price,
                e.description,
                e.start_datetime,
                e.end_datetime,
                e.created_at,
                u.username as creator_username,
                t.team_id,
                t.name as team_name,
                t.country,
                t.game_playing,
                t.rank,
                t.team_size,
                t.year_of_foundation
            FROM event e
            LEFT JOIN creators c ON e.creator_id = c.creator_id
            LEFT JOIN users u ON c.user_id = u.user_id
            LEFT JOIN event_teams et ON e.event_id = et.event_id
            LEFT JOIN team t ON et.team_id = t.team_id
            ORDER BY e.event_id, t.team_id
        `;

        const rows = await this.db.query(query);
        
        const eventsMap = new Map<string, Event>();
        
        rows.forEach((row: any) => {
            const eventId = row.event_id;
            
            if (!eventsMap.has(eventId)) {
                eventsMap.set(eventId, {
                    event_id: row.event_id,
                    title: row.title,
                    game_type: row.game_type,
                    category: row.category,
                    status: row.status,
                    is_popular: row.is_popular,
                    viewers: row.viewers,
                    image: row.image,
                    price: row.price,
                    description: row.description,
                    start_datetime: row.start_datetime,
                    end_datetime: row.end_datetime,
                    created_at: row.created_at,
                    teams: []
                });
            }
            
            if (row.team_id) {
                const event = eventsMap.get(eventId);
                event.teams.push({
                    team_id: row.team_id,
                    name: row.team_name,
                    country: row.country,
                    game_playing: row.game_playing,
                    rank: row.rank,
                    team_size: row.team_size,
                    year_of_foundation: row.year_of_foundation
                });
            }
        });
        
        return Array.from(eventsMap.values());
    }

    async getById(id: string): Promise<Event> {
        try {
            console.log(`Fetching event with ID: ${id}`);

            const query = `
                SELECT 
                    e.event_id,
                    e.title,
                    e.game_type,
                    e.category,
                    e.status,
                    e.is_popular,
                    e.viewers,
                    e.image,
                    e.price,
                    e.description,
                    e.start_datetime,
                    e.end_datetime,
                    e.created_at,
                    u.username as creator_username,
                    u.first_name as creator_first_name,
                    u.last_name as creator_last_name,
                    t.team_id,
                    t.name as team_name,
                    t.country,
                    t.game_playing,
                    t.rank,
                    t.team_size,
                    t.year_of_foundation,
                    es.views,
                    es.shares,
                    es.last_updated
                FROM event e
                LEFT JOIN creators c ON e.creator_id = c.creator_id
                LEFT JOIN users u ON c.user_id = u.user_id
                LEFT JOIN event_teams et ON e.event_id = et.event_id
                LEFT JOIN team t ON et.team_id = t.team_id
                LEFT JOIN event_stats es ON e.event_id = es.event_id
                WHERE e.event_id = ?
                ORDER BY t.team_id
            `;

            const rows = await this.db.query(query, [id]);
            
            if (rows.length === 0) {
                console.log(`No event found with ID: ${id}`);
                return null;
            }

            const firstRow = rows[0];
            
            const event: Event = {
                event_id: firstRow.event_id,
                title: firstRow.title,
                game_type: firstRow.game_type,
                category: firstRow.category,
                status: firstRow.status,
                is_popular: firstRow.is_popular,
                viewers: firstRow.viewers,
                image: firstRow.image,
                price: firstRow.price,
                description: firstRow.description,
                start_datetime: firstRow.start_datetime,
                end_datetime: firstRow.end_datetime,
                created_at: firstRow.created_at,
                creator_username: firstRow.creator_username,
                teams: [],
                players: [],
                stats: null,
                chat_messages: [],
                content: []
            };

            if (firstRow.views !== null) {
                event.stats = {
                    views: firstRow.views,
                    shares: firstRow.shares,
                    last_updated: firstRow.last_updated
                };
            }

            const addedTeams = new Set();
            rows.forEach((row: any) => {
                if (row.team_id && !addedTeams.has(row.team_id)) {
                    event.teams.push({
                        team_id: row.team_id,
                        name: row.team_name,
                        country: row.country,
                        game_playing: row.game_playing,
                        rank: row.rank,
                        team_size: row.team_size,
                        year_of_foundation: row.year_of_foundation
                    });
                    addedTeams.add(row.team_id);
                }
            });
            if (event.teams.length > 0) {
                const teamIds = event.teams.map(team => team.team_id);
                const playersQuery = `
                    SELECT 
                        p.player_id,
                        p.first_name,
                        p.last_name,
                        p.nickname,
                        p.age,
                        p.current_team_id,
                        t.name as team_name
                    FROM players p
                    JOIN team t ON p.current_team_id = t.team_id
                    WHERE p.current_team_id IN (${teamIds.map(() => '?').join(',')})
                    ORDER BY p.current_team_id, p.player_id
                `;

                const playerRows = await this.db.query(playersQuery, teamIds);
                event.players = playerRows.map((player: any) => ({
                    player_id: player.player_id,
                    first_name: player.first_name,
                    last_name: player.last_name,
                    nickname: player.nickname,
                    age: player.age,
                    current_team_id: player.current_team_id,
                    team_name: player.team_name
                }));
            }

            const chatQuery = `
                SELECT 
                    ec.message_id,
                    ec.user_id,
                    u.username,
                    ec.message,
                    ec.created_at
                FROM event_chat ec
                JOIN users u ON ec.user_id = u.user_id
                WHERE ec.event_id = ?
                ORDER BY ec.created_at ASC
                LIMIT 50
            `;

            const chatRows = await this.db.query(chatQuery, [id]);
            event.chat_messages = chatRows.map((chat: any) => ({
                message_id: chat.message_id,
                user_id: chat.user_id,
                username: chat.username,
                message: chat.message,
                created_at: chat.created_at
            }));

            const contentQuery = `
                SELECT 
                    c.content_id,
                    c.event_id,
                    c.content_creator_id,
                    c.title,
                    c.type,
                    c.url,
                    c.description,
                    c.scheduled_viewing_time,
                    c.created_at,
                    c.is_approved,
                    u.username as creator_username,
                    cs.views,
                    cs.shares,
                    cs.likes,
                    cs.last_updated as stats_last_updated
                FROM content c
                LEFT JOIN content_creators cc ON c.content_creator_id = cc.content_creator_id
                LEFT JOIN users u ON cc.user_id = u.user_id
                LEFT JOIN content_stats cs ON c.content_id = cs.content_id
                WHERE c.event_id = ? AND c.is_approved = TRUE
                ORDER BY c.created_at DESC
            `;

            const contentRows = await this.db.query(contentQuery, [id]);
            event.content = contentRows.map((content: any) => ({
                content_id: content.content_id,
                event_id: content.event_id,
                content_creator_id: content.content_creator_id,
                title: content.title,
                type: content.type,
                url: content.url,
                description: content.description,
                scheduled_viewing_time: content.scheduled_viewing_time,
                created_at: content.created_at,
                is_approved: content.is_approved,
                creator_username: content.creator_username,
                stats: content.views !== null ? {
                    views: content.views,
                    shares: content.shares,
                    likes: content.likes,
                    last_updated: content.stats_last_updated
                } : undefined
            }));

            console.log(`Successfully fetched event: ${event.title} with ${event.teams.length} teams and ${event.players.length} players`);
            return event;

        } catch (error) {
            console.error('Error fetching event details:', error);
            throw new Error('Failed to fetch event details');
        }
    }

    async getEventsByStatus(status: string): Promise<Event[]> {
        const query = `
            SELECT 
                e.event_id,
                e.title,
                e.game_type,
                e.category,
                e.status,
                e.is_popular,
                e.viewers,
                e.image,
                e.price,
                e.description,
                e.start_datetime,
                e.end_datetime,
                e.created_at,
                u.username as creator_username,
                t.team_id,
                t.name as team_name,
                t.country,
                t.game_playing,
                t.rank,
                t.team_size
            FROM event e
            LEFT JOIN creators c ON e.creator_id = c.creator_id
            LEFT JOIN users u ON c.user_id = u.user_id
            LEFT JOIN event_teams et ON e.event_id = et.event_id
            LEFT JOIN team t ON et.team_id = t.team_id
            WHERE e.status = ?
            ORDER BY e.start_datetime ASC, e.event_id, t.team_id
        `;

        const rows = await this.db.query(query, [status]);
        
        const eventsMap = new Map<string, Event>();
        
        rows.forEach((row: any) => {
            const eventId = row.event_id;
            
            if (!eventsMap.has(eventId)) {
                eventsMap.set(eventId, {
                    event_id: row.event_id,
                    title: row.title,
                    game_type: row.game_type,
                    category: row.category,
                    status: row.status,
                    is_popular: row.is_popular,
                    viewers: row.viewers,
                    image: row.image,
                    price: row.price,
                    description: row.description,
                    start_datetime: row.start_datetime,
                    end_datetime: row.end_datetime,
                    created_at: row.created_at,
                    creator_username: row.creator_username,
                    teams: []
                });
            }
            
            if (row.team_id) {
                const event = eventsMap.get(eventId);
                event.teams.push({
                    team_id: row.team_id,
                    name: row.team_name,
                    country: row.country,
                    game_playing: row.game_playing,
                    rank: row.rank,
                    team_size: row.team_size
                });
            }
        });
        
        return Array.from(eventsMap.values());
    }

    async getCount() {
        try {
            const query = 'SELECT COUNT(*) as count FROM event';
            const result = await this.db.query(query);
            
            return {
                success: true,
                count: result[0].count
            };
        } catch (error) {
            console.error('Error counting events:', error);
            return {
                success: false,
                message: 'Server error',
                count: 0
            };
        }
    }

    async create(eventData: any): Promise<any> {
        const connection = await this.db.getConnection();
        
        try {
            await connection.beginTransaction();
            if (!eventData.event_id || !eventData.title || !eventData.creator_id) {
                throw new Error('Missing required fields');
            }
            const [creatorRows] = await connection.execute(
                'SELECT creator_id FROM creators WHERE creator_id = ?', 
                [eventData.creator_id]
            );
            const creatorCheck = await connection.query(
                'SELECT creator_id FROM creators WHERE creator_id = ?', 
                [eventData.creator_id]
            );
            

            if (eventData.team1_id && eventData.team2_id) {
                if (eventData.team1_id === eventData.team2_id) {
                    throw new Error('Teams must be different');
                }

                const teamCheck = await connection.query(
                    'SELECT team_id FROM team WHERE team_id IN (?, ?)', 
                    [eventData.team1_id, eventData.team2_id]
                );
                
                if (teamCheck.length !== 2) {
                    throw new Error('One or both teams not found');
                }
            }

            const insertEventQuery = `
                INSERT INTO event (
                    event_id, creator_id, title, game_type, category, status, 
                    is_popular, viewers, image, price, description, 
                    start_datetime, end_datetime
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await connection.query(insertEventQuery, [
                eventData.event_id,
                eventData.creator_id,
                eventData.title,
                eventData.game_type,
                eventData.category,
                eventData.status || 'upcoming',
                eventData.is_popular || false,
                eventData.viewers || 0,
                eventData.image,
                eventData.price || 0,
                eventData.description,
                eventData.start_datetime,
                eventData.end_datetime
            ]);
            if (eventData.team1_id && eventData.team2_id) {
                const insertTeamsQuery = 'INSERT INTO event_teams (event_id, team_id) VALUES (?, ?), (?, ?)';
                await connection.query(insertTeamsQuery, [
                    eventData.event_id, eventData.team1_id, 
                    eventData.event_id, eventData.team2_id
                ]);
            }

            await connection.commit();
            
            return {
                success: true,
                message: 'Event created successfully',
                event_id: eventData.event_id
            };

        } catch (error) {
            await connection.rollback();
            console.error('Error creating event:', error);
            
            return {
                success: false,
                message: error.message || 'Server error'
            };
        } finally {
            connection.release();
        }
    }
}