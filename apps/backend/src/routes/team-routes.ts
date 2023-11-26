/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response, Router } from 'express';
import TeamRepository from '../sql/repositories/team.repository';
import {
  isAuthenticated,
  isMember,
  isTeamAdmin,
  isVerified,
} from '../middlewares';
import { getActiveUserId } from '../util';
import PostgresTeam from '../sql/models/team';
import PostgresUser from '../sql/models/user';
import UserRepository from '../sql/repositories/user.repository';

const teamRouter = Router();

teamRouter.get(
  '/myteams',
  [isAuthenticated, isVerified],
  async (req: Request, res: Response) => {
    const userId: number = getActiveUserId(req);

    if (userId) {
      await TeamRepository.getTeamsOfUser(userId)
        .then(fullTeamData => {
          const teams = fullTeamData.map((t: PostgresTeam) => {
            return {
              id: t.id,
              country: t.country,
              team_name: t.team_name,
              min_availability: t.min_availability,
            };
          });
          return res.status(200).send(teams);
        })
        .catch(err => {
          console.error(err);
          return res.status(err.status).json({ error: err.message });
        });
    }
  },
);

teamRouter.get(
  '/:id/is-team-admin',
  [isAuthenticated, isVerified],
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) return next();

    try {
      const userId: number = getActiveUserId(req);
      const teamId: number = parseInt(req.params.id, 10);

      const result = await isTeamAdmin(userId, teamId);
      return res.status(200).send(result);
    } catch (error: any) {
      console.error('Error while checking team admin', error);
      return res.status(500).json({ error: error.message });
    }
  },
);

teamRouter.get(
  '/:id/getmembers',
  [isAuthenticated, isVerified],
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.id) return next();

    const userId: number = getActiveUserId(req);
    const teamId: number = parseInt(req.params.id, 10);

    if (!(await isMember(userId, teamId)))
      return res.status(401).json({ error: 'Unauthorized' });

    return await TeamRepository.getTeamMembers(teamId)
      .then(users => {
        const members = users.map((user: PostgresUser) => {
          return {
            id: user.id,
            username: user.username,
            currentUser: user.id === userId,
          };
        });
        return res.status(200).send(members);
      })
      .catch(err => {
        console.error(err);
        return res.status(err.status).json({ error: err.message });
      });
  },
);

teamRouter.get(
  '/:id/getteaminfo',
  [isAuthenticated, isVerified],
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.id) return next();

    const userId: number = getActiveUserId(req);
    const teamId: number = parseInt(req.params.id, 10);
    const isAuthorized: boolean = await isMember(userId, teamId);

    if (!isAuthorized) return res.status(401).json({ error: 'Unauthorized' });

    return await PostgresTeam.findByPk(teamId)
      .then(team => res.status(200).send(team))
      .catch(err => res.status(err.status).json({ error: err.message }));
  },
);

teamRouter.post(
  '/addteam',
  [isAuthenticated, isVerified],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = getActiveUserId(req);

    if (!userId || !req.params) return next();

    const { teamName, countryCode, minAvailability } = req.body;

    if (userId && teamName) {
      return await TeamRepository.createTeam(
        userId,
        teamName,
        countryCode,
        parseFloat(minAvailability) || null,
      )
        .then(team => {
          return res.status(200).send({ authenticated: true, team });
        })
        .catch(err => {
          console.error(err);
          return res.status(err.status).json({ error: err.message });
        });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  },
);

teamRouter.post(
  '/addmember',
  [isAuthenticated, isVerified],
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.email || !req.body.teamId) return next();

    try {
      const email: string = req.body.email;
      const teamId: number = parseInt(req.body.teamId, 10);

      const user = await UserRepository.findUserByEmail(email);
      if (!user) res.status(404).json({ error: 'Email not found' });

      if (user?.id && teamId) {
        const activeUserId: number = getActiveUserId(req);

        if (!(await isTeamAdmin(activeUserId, teamId)))
          return res.status(401).json({ error: 'Unauthorized' });

        await TeamRepository.addTeamMember(user?.id, teamId);
        const members = await TeamRepository.getTeamMembers(teamId);
        const memberIds = members.map(member => member.id);

        if (memberIds.includes(user?.id)) {
          const membersNoPw = members.map((user: PostgresUser) => {
            return {
              id: user.id,
              username: user.username,
              currentUser: user.id === activeUserId,
            };
          });
          return res.status(200).send(membersNoPw);
        } else {
          return res.status(500).json({ error: 'Could not process' });
        }
      } else {
        return res.status(402).json({ error: 'Bad Request' });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

teamRouter.post(
  '/deletemember',
  [isAuthenticated, isVerified],
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.userId || !req.body.teamId) return next();

    try {
      const userId: number = parseInt(req.body.userId, 10);
      const teamId: number = parseInt(req.body.teamId, 10);

      if (userId && teamId) {
        const activeUserId: number = getActiveUserId(req);

        if (!(await isTeamAdmin(activeUserId, teamId)))
          return res.status(401).json({ error: 'Unauthorized' });

        const result = await TeamRepository.removeTeamMember(userId, teamId);

        if (result) {
          return res.status(200).json({
            authenticated: true,
            message: 'User successfully removed from team',
          });
        } else {
          return res.status(500).json({ error: 'Could not process' });
        }
      } else {
        return res.status(402).json({ error: 'Bad Request' });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default teamRouter;
