import * as mysql from 'mysql2/promise';
export declare class DbService {
    private connection;
    private pool;
    constructor();
    private connect;
    private createPool;
    getConnection(): Promise<mysql.PoolConnection>;
    query(sql: string, params?: any[]): Promise<any[]>;
    executeQuery(sql: string, params?: any[]): Promise<any>;
    closeConnection(): Promise<void>;
}
