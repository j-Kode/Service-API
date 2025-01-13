import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { expressJwtSecret, GetVerificationKey } from 'jwks-rsa';
import { promisify } from 'util';
import { expressjwt } from 'express-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_ISSUER_URL: string;

  constructor(private configService: ConfigService) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE');
    this.AUTH0_ISSUER_URL = this.configService.get('AUTH0_ISSUER_URL');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [req, res] = context.getArgs();

    const checkJwt = promisify(
      expressjwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_ISSUER_URL}.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_ISSUER_URL,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJwt(req, res);

      //Through auth0 and the above jwt check we see here, permissions and roles if needed.
      console.log(req.auth);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
