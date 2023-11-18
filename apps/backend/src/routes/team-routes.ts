import { NextFunction, Request, Response, Router } from 'express';
import TeamRepository from '../sql/repositories/team.repository';
import {
  getActiveUserId,
  isAuthenticated,
  isMember,
  isTeamAdmin,
} from '../middlewares';
import PostgresTeam from '../sql/models/team';
import PostgresUser from '../sql/models/user';

const teamRouter = Router();

teamRouter.get(
  '/myteams',
  isAuthenticated,
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
  }
);

teamRouter.get(
  '/:id/getmembers',
  isAuthenticated,
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
            currentUser: user.id === userId
          };
        });
        return res.status(200).send(members);
      })
      .catch(err => {
        console.error(err);
        return res.status(err.status).json({ error: err.message });
      });
  }
);

teamRouter.get(
  '/:id/getteaminfo',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.id) return next();

    const userId: number = getActiveUserId(req);
    const teamId: number = parseInt(req.params.id, 10);
    const isAuthorized: boolean = await isMember(userId, teamId);

    if (!isAuthorized) return res.status(401).json({ error: 'Unauthorized' });

    return await PostgresTeam.findByPk(teamId)
      .then(team => res.status(200).send(team))
      .catch(err => res.status(err.status).json({ error: err.message }));
  }
);

teamRouter.post(
  '/addteam',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = getActiveUserId(req);

    if (!userId || !req.params) return next();

    const { teamName, countryCode, minAvailability } = req.body;

    if (userId && teamName) {
      return await TeamRepository.createTeam(
        userId,
        teamName,
        countryCode,
        parseFloat(minAvailability) || null
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
  }
);

teamRouter.post(
  '/addmember',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.userId || !req.params.teamId) return next();

    const userId: number = parseInt(req.params.userId, 10);
    const teamId: number = parseInt(req.params.teamId, 10);

    if (userId && teamId) {
      const activeUserId: number = getActiveUserId(req);

      if (!(await isTeamAdmin(activeUserId, teamId)))
        return res.status(401).json({ error: 'Unauthorized' });

      await TeamRepository.addTeamMember(userId, teamId);
      const members = await TeamRepository.getTeamMembers(teamId);
      const memberIds = members.map(member => member.id);

      if (memberIds.includes(userId)) {
        return res.status(200).send({ authenticated: true, memberIds });
      } else {
        return res.status(500).json({ error: 'Could not process' });
      }
    } else {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }
  }
);

teamRouter.post(
  '/deletemember',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.userId || !req.params.teamId) return next();

    const userId: number = parseInt(req.params.userId, 10);
    const teamId: number = parseInt(req.params.teamId, 10);

    if (userId && teamId) {
      const activeUserId: number = getActiveUserId(req);

      if (!(await isTeamAdmin(activeUserId, teamId)))
        return res.status(401).json({ error: 'Unauthorized' });

      const result = await TeamRepository.removeTeamMember(userId, teamId);

      if (result)
        return res.status(200).json({
          authenticated: true,
          message: 'User successfully removed from team',
        });
      else return res.status(500).json({ error: 'Could not process' });
    } else {
      return res.status(422).json({ error: 'Unprocessable Entity' });
    }
  }
);

export default teamRouter;
