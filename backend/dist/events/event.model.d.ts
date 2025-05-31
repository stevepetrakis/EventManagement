export interface Team {
    team_id: string;
    name: string;
    country: string;
    game_playing: string;
    rank?: number;
    team_size?: number;
    year_of_foundation?: number;
}
export interface Player {
    player_id: string;
    first_name: string;
    last_name: string;
    nickname?: string;
    age?: number;
    current_team_id?: string;
    team_name?: string;
}
export interface EventStats {
    views: number;
    shares: number;
    last_updated: string;
}
export interface ChatMessage {
    message_id: string;
    user_id: string;
    username: string;
    message: string;
    created_at: string;
}
export interface Content {
    content_id: string;
    event_id: string;
    content_creator_id: string;
    title: string;
    type: 'image' | 'video' | 'highlight';
    url?: string;
    description?: string;
    scheduled_viewing_time?: string;
    created_at: string;
    is_approved: boolean;
    creator_username?: string;
    stats?: {
        views: number;
        shares: number;
        likes: number;
        last_updated: string;
    };
}
export interface Event {
    event_id: string;
    title: string;
    game_type: string;
    category: string;
    status: string;
    is_popular?: boolean;
    viewers?: number;
    image: string;
    price: number;
    description?: string;
    start_datetime: string;
    end_datetime?: string;
    created_at: string;
    creator_username?: string;
    teams: Team[];
    players?: Player[];
    stats?: EventStats;
    chat_messages?: ChatMessage[];
    content?: Content[];
}
