import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DbService {
  private connection: mysql.Connection;
  private pool: mysql.Pool;

  constructor() {
    this.connect();
    this.createPool();
  }

  private async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'app_user',
        password: process.env.DB_PASSWORD || 'app_pass_12345',
        database: process.env.DB_NAME || 'app_db',
      });
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private createPool() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'app_user',
      password: process.env.DB_PASSWORD || 'app_pass_12345',
      database: process.env.DB_NAME || 'app_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async getConnection(): Promise<mysql.PoolConnection> {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('Error getting connection from pool:', error);
      throw error;
    }
  }

  async query(sql: string, params: any[] = []): Promise<any[]> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      const [rows] = await this.connection.execute(sql, params);
      return rows as any[];
    } catch (error) {
      console.error('Database query error:', error);
      
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Attempting to reconnect to database...');
        await this.connect();
        const [rows] = await this.connection.execute(sql, params);
        return rows as any[];
      }
      
      throw error;
    }
  }

  async executeQuery(sql: string, params: any[] = []): Promise<any> {
    try {
      if (!this.connection) {
        await this.connect();
      }
      
      const result = await this.connection.execute(sql, params);
      return result;
    } catch (error) {
      console.error('Database execute error:', error);
      
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Attempting to reconnect to database...');
        await this.connect();
        return await this.connection.execute(sql, params);
      }
      
      throw error;
    }
  }

  async closeConnection() {
    if (this.connection) {
      await this.connection.end();
    }
  }
}