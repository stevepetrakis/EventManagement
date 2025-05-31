"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const common_1 = require("@nestjs/common");
const mysql = require("mysql2/promise");
let DbService = class DbService {
    constructor() {
        this.connect();
        this.createPool();
    }
    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 3306,
                user: process.env.DB_USER || 'app_user',
                password: process.env.DB_PASSWORD || 'app_pass_12345',
                database: process.env.DB_NAME || 'app_db',
            });
            console.log('Database connected successfully');
        }
        catch (error) {
            console.error('Database connection failed:', error);
            setTimeout(() => this.connect(), 5000);
        }
    }
    createPool() {
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
    async getConnection() {
        try {
            return await this.pool.getConnection();
        }
        catch (error) {
            console.error('Error getting connection from pool:', error);
            throw error;
        }
    }
    async query(sql, params = []) {
        try {
            if (!this.connection) {
                await this.connect();
            }
            const [rows] = await this.connection.execute(sql, params);
            return rows;
        }
        catch (error) {
            console.error('Database query error:', error);
            if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Attempting to reconnect to database...');
                await this.connect();
                const [rows] = await this.connection.execute(sql, params);
                return rows;
            }
            throw error;
        }
    }
    async executeQuery(sql, params = []) {
        try {
            if (!this.connection) {
                await this.connect();
            }
            const result = await this.connection.execute(sql, params);
            return result;
        }
        catch (error) {
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
};
exports.DbService = DbService;
exports.DbService = DbService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DbService);
//# sourceMappingURL=db.service.js.map