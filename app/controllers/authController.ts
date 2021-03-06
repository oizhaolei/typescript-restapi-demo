import { NextFunction, Request, Response } from 'express';
import passport from '../utils/passport';
import log4js from '../utils/logger';

const logger = log4js('controllers/authController');

class AuthController {
  public authenticateJWT = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return passport.authenticate('jwt', function (err, user) {
      if (err) {
        logger.debug(err);
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      }
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      } else {
        req.user = user;
        return next();
      }
    })(req, res, next);
  };

  public authorizeJWT = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return passport.authenticate('jwt', function (err, user, jwtToken) {
      if (err) {
        logger.debug(err);
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      }
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      } else {
        const scope = req.baseUrl.split('/').slice(-1)[0];
        const authScope = jwtToken.scope;
        if (authScope && authScope.indexOf(scope) > -1) {
          return next();
        } else {
          return res.status(401).json({ status: 'error', code: 'unauthorized' });
        }
      }
    })(req, res, next);
  };
}

export default AuthController;
