import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@taskforce/shared-types';
import { TaskUserRepository } from '../task-user/repository/task-user.repository';
import { TaskUserEntity } from '../task-user/task-user.entity';
import {
  ACCESS_TOKEN_EXPIRE,
  INVALID_REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_EXPIRE,
  USER_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from './auth.const';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly taskUserRepository: TaskUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: CreateUserDto): Promise<User> {
    const { name, email, city, password, role, birthDate } = dto;
    const taskUser: User = {
      name,
      email,
      city,
      passwordHash: '',
      role,
      birthDate: new Date(birthDate),
      avatar: '',
    };

    const existingUser = await this.taskUserRepository.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException(USER_EXISTS_ERROR);
    }

    const userEntity = new TaskUserEntity(taskUser);
    await userEntity.setPassword(password);

    return this.taskUserRepository.create(userEntity);
  }

  async verifyUser(dto: LoginUserDto): Promise<User> {
    const { email, password } = dto;
    const existingUser = await this.taskUserRepository.findByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const userEntity = new TaskUserEntity(existingUser);
    if (!(await userEntity.comparePassword(password))) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    return userEntity.toObject();
  }

  async getUser(id: string): Promise<User> {
    const existingUser = await this.taskUserRepository.findById(id);

    if (!existingUser) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    return existingUser;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const existingUser = await this.taskUserRepository.findById(id);

    if (!existingUser) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    return this.taskUserRepository.update(id, {
      ...dto,
      birthDate: dto.birthDate && new Date(dto.birthDate),
    });
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<User> {
    const { newPassword, oldPassword } = dto;
    const existingUser = await this.taskUserRepository.findById(id);

    if (!existingUser) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const userEntity = new TaskUserEntity(existingUser);
    if (!(await userEntity.comparePassword(oldPassword))) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    await userEntity.setPassword(newPassword); // TODO: no need to create user entity?

    return this.taskUserRepository.update(id, {
      passwordHash: userEntity.passwordHash,
    });
  }

  async loginUser(user: User) {
    const { token, refreshToken } = await this.generateTokens(user);

    const userEntity = new TaskUserEntity(user);
    await userEntity.setRefreshToken(refreshToken); // TODO: no need to create user entity?
    await this.taskUserRepository.update(user._id, {
      refreshTokenHash: userEntity.refreshTokenHash,
    });

    return { token, refreshToken };
  }

  async refresh(userId: string, refreshToken: string) {
    const existingUser = await this.taskUserRepository.findById(userId);
    if (!existingUser) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const userEntity = new TaskUserEntity(existingUser);
    if (!(await userEntity.compareRefreshToken(refreshToken))) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);
    }

    const { token, refreshToken: newRefreshToken } = await this.generateTokens(
      userEntity
    );

    await userEntity.setRefreshToken(newRefreshToken); // TODO: no need to create user entity?
    await this.taskUserRepository.update(userId, {
      refreshTokenHash: userEntity.refreshTokenHash,
    });

    return { token, refreshToken: newRefreshToken };
  }

  private async generateRefreshToken({ _id, email, role, name }: User) {
    const payload = { sub: _id, email, role, name };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('rt.secret'),
      expiresIn: REFRESH_TOKEN_EXPIRE,
    });
  }

  private async generateAccessToken({ _id, email, role, name }: User) {
    const payload = { sub: _id, email, role, name };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });
  }

  private async generateTokens(user: User) {
    const [token, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return { token, refreshToken };
  }
}
