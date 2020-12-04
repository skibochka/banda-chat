import * as jwtService from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import authConstants from '../constants/constants';
import redisConnection from '../utils/redisConnection';
import { IUser } from '../interfaces/users.interface';
import usersService from './usersService';

dotenv.config();

class Authorization {
  private redisClient = redisConnection;

  public async verifyUser(cred: IUser) {
    const user = await usersService.getOne(cred.login);
    const passwordCompared = await bcrypt.compare(cred.password, user.password);

    if (passwordCompared) {
      return {
        _id: user._id,
        login: user.login,
      };
    }

    return null;
  }

  public async login(user: IUser) {
    const payload = {
      _id: user._id,
      login: user.login,
    };

    const accessToken = jwtService.sign(payload, authConstants.secret, {
      expiresIn: authConstants.expirationTime.jwt.default.accessToken,
    });
    const refreshToken = jwtService.sign(payload, authConstants.secret, {
      expiresIn: authConstants.expirationTime.jwt.default.refreshToken,
    });

    await this.redisClient.set(
      payload.login,
      refreshToken,
      'EX',
      authConstants.expirationTime.redis.default.refreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public getRefreshTokenByEmail(email: string): Promise<string | null> {
    return this.redisClient.get(email);
  }

  public deleteTokenByEmail(email: string): Promise<number> {
    return this.redisClient.del(email);
  }

  public deleteAllTokens(): Promise<string> {
    return this.redisClient.flushall();
  }

  public addToken(token, value): Promise<string | null> {
    return this.redisClient.set(
      token,
      value,
      'EX',
      authConstants.expirationTime.redis.default.accountVerificationToken,
    );
  }

  public getByToken(token: string): Promise<string | null> {
    return this.redisClient.get(token);
  }
}

export default new Authorization();
