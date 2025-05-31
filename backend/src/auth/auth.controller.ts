import { Controller, Post, Body, HttpCode, HttpStatus, Param, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    console.log('Login attempt:', { username: loginDto.username }); 
    
    const result = await this.authService.login(loginDto);
    
    if (result.success) {
      console.log('Login successful for user:', loginDto.username);
    } else {
      console.log('Login failed for user:', loginDto.username, 'Reason:', result.message);
    }
    
    return result;
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() validateTokenDto: any) {
    return await this.authService.validateToken(validateTokenDto.token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return {
      success: true,
      message: 'Logout successful'
    };
  }

  @Get('creator-id/:userId')
  async getCreatorId(@Param('userId') userId: string) {
    return await this.authService.getCreatorId(userId);
  }
}