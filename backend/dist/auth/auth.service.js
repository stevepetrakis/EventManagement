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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
let AuthService = class AuthService {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        try {
            const query = `
        SELECT 
          u.user_id,
          u.first_name,
          u.last_name,
          u.username,
          u.email,
          u.date_of_birth,
          u.created_at,
          CASE 
            WHEN c.creator_id IS NOT NULL THEN 'creator'
            WHEN s.subscriber_id IS NOT NULL THEN 'subscriber'
            ELSE 'user'
          END as user_type
        FROM users u
        LEFT JOIN creators c ON u.user_id = c.user_id
        LEFT JOIN subscribers s ON u.user_id = s.user_id
        WHERE u.username = ? AND u.password = ?
      `;
            const result = await this.dbService.query(query, [username, password]);
            if (result.length === 0) {
                return {
                    success: false,
                    message: 'Invalid username or password'
                };
            }
            const user = result[0];
            const { password: _, ...userWithoutPassword } = user;
            return {
                success: true,
                message: 'Login successful',
                user: userWithoutPassword,
                userType: user.user_type,
                token: this.generateSimpleToken(user.user_id)
            };
        }
        catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    async validateToken(token) {
        try {
            const userId = this.decodeSimpleToken(token);
            if (!userId) {
                return {
                    success: false,
                    message: 'Invalid token'
                };
            }
            const query = `
        SELECT 
          u.user_id,
          u.first_name,
          u.last_name,
          u.username,
          u.email,
          CASE 
            WHEN c.creator_id IS NOT NULL THEN 'creator'
            WHEN s.subscriber_id IS NOT NULL THEN 'subscriber'
            ELSE 'user'
          END as user_type
        FROM users u
        LEFT JOIN creators c ON u.user_id = c.user_id
        LEFT JOIN subscribers s ON u.user_id = s.user_id
        WHERE u.user_id = ?
      `;
            const result = await this.dbService.query(query, [userId]);
            if (result.length === 0) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            return {
                success: true,
                user: result[0],
                userType: result[0].user_type
            };
        }
        catch (error) {
            console.error('Token validation error:', error);
            return {
                success: false,
                message: 'Token validation failed'
            };
        }
    }
    async getCreatorId(userId) {
        try {
            const query = 'SELECT creator_id FROM creators WHERE user_id = ?';
            const result = await this.dbService.query(query, [userId]);
            if (result.length === 0) {
                return {
                    success: false,
                    message: 'Creator not found for this user'
                };
            }
            return {
                success: true,
                creator_id: result[0].creator_id
            };
        }
        catch (error) {
            console.error('Error fetching creator:', error);
            return {
                success: false,
                message: 'Server error'
            };
        }
    }
    generateSimpleToken(userId) {
        const timestamp = Date.now();
        return Buffer.from(`${userId}:${timestamp}`).toString('base64');
    }
    decodeSimpleToken(token) {
        try {
            const decoded = Buffer.from(token, 'base64').toString('ascii');
            const [userId] = decoded.split(':');
            return userId;
        }
        catch {
            return null;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], AuthService);
//# sourceMappingURL=auth.service.js.map