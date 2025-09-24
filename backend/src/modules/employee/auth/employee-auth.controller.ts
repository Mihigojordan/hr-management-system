import {
  Body,
  Controller,
  Post,
  Res,
  Get,
  Req,
  UseGuards,
  HttpException,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { EmployeeAuthService } from './employee-auth.service';
import { RequestWithEmployee } from 'src/common/interfaces/employee.interface';
import { EmployeeJwtAuthGuard } from 'src/guards/employeeGuard.guard';

@Controller('employee/auth')
export class EmployeeAuthController {
  constructor(private readonly employeeAuth: EmployeeAuthService) {}

  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const loginResult = await this.employeeAuth.employeeLogin(body);

      if (loginResult.twoFARequired) {
        return res.status(200).json(loginResult);
      }

      res.cookie('AccessEmployeeToken', loginResult.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(loginResult);
    } catch (error: any) {
      throw new HttpException(error.message || 'Login failed', 400);
    }
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body() body: { employeeId: string; otp: string },
    @Res() res: Response,
  ) {
    try {
      const verifyResult = await this.employeeAuth.verifyOTP(
        body.employeeId,
        body.otp,
      );

      res.cookie('AccessEmployeeToken', verifyResult.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(verifyResult);
    } catch (error: any) {
      throw new HttpException(error.message || 'OTP verification failed', 400);
    }
  }

  @Get('profile')
  @UseGuards(EmployeeJwtAuthGuard)
  async profile(@Req() req: RequestWithEmployee) {
    return { employee: req.employee, authenticated: true };
  }

  @Patch('change-password')
  @UseGuards(EmployeeJwtAuthGuard)
  async changePassword(
    @Req() req: RequestWithEmployee,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.employeeAuth.changePassword(
      req.employee.id,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Post('logout')
  @UseGuards(EmployeeJwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('AccessEmployeeToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }
}
