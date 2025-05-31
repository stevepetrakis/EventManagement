import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DbService) {}

  async login(loginDto: any) {
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

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Internal server error'
      };
    }
  }

  async validateToken(token: string) {
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

    } catch (error) {
      console.error('Token validation error:', error);
      return {
        success: false,
        message: 'Token validation failed'
      };
    }
  }

  async getCreatorId(userId: string) {
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
    } catch (error) {
      console.error('Error fetching creator:', error);
      return {
        success: false,
        message: 'Server error'
      };
    }
  }

  private generateSimpleToken(userId: string): string {
    const timestamp = Date.now();
    return Buffer.from(`${userId}:${timestamp}`).toString('base64');
  }

  private decodeSimpleToken(token: string): string | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('ascii');
      const [userId] = decoded.split(':');
      return userId;
    } catch {
      return null;
    }
  }
}