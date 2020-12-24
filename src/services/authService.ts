import * as JwtService from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import authConstants from '../constants/constants';
import redisConnection from '../utils/redisConnection';
import { IUser } from '../interfaces/user.interface';
import { UserService } from './userService';

export class AuthService {
  private userService: UserService = new UserService();

  private readonly jwtService: JwtService = JwtService;

  private redisClient = redisConnection;

  public async verifyUser(cred: IUser) {
    const user = await this.userService.getOne(cred.email);
    const passwordCompared = await bcrypt.compare(cred.password, user.password);

    if (passwordCompared) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
    }

    return null;
  }

  public async login(user: IUser) {
    const accessToken = this.jwtService.sign(user, authConstants.secret, {
      expiresIn: authConstants.expirationTime.jwt.default.accessToken,
    });
    const refreshToken = this.jwtService.sign(user, authConstants.secret, {
      expiresIn: authConstants.expirationTime.jwt.default.refreshToken,
    });

    await this.redisClient.set(
      user.email,
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

  public getByToken(token: string | string[]) {
    return this.jwtService.verify(token, authConstants.secret);
  }
}
