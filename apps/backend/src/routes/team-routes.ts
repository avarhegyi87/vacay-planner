import { NextFunction, Request, Response, Router } from 'express';
import TeamRepository from '../sql/repositories/team.repository';
import {
  getActiveUserId,
  isAuthenticated,
  isMember,
  isTeamAdmin,
} from '../middlewares';
import PostgresTeam from '../sql/models/team';

const teamRouter = Router();

teamRouter.get(
  '/api/myteams',
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
          res.status(200).send({ authenticated: true, teams });
        })
        .catch(err => {
          res.status(err.status).json({ error: err.message });
          console.error(err);
        });
    }
  }
);

teamRouter.get(
  '/api/teams/:id/getusers',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.id) return next();

    const userId: number = getActiveUserId(req);
    const teamId: number = parseInt(req.params.id, 10);

    if (!isMember(userId, teamId))
      res.status(401).json({ error: 'Unauthrozized' });

    return await TeamRepository.getTeamMembers(teamId)
      .then(users => {
        const ids = users.map(user => user.id);
        res.status(200).send({ authenticated: true, ids });
      })
      .catch(err => {
        res.status(err.status).json({ error: err.message });
        console.error(err);
      });
  }
);

teamRouter.post(
  '/api/teams/add',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = getActiveUserId(req);

    if (!userId || !req.params) return next();

    if (userId) {
      const { teamName, country, minAvailability } = req.params;
      return await TeamRepository.createTeam(
        userId,
        teamName,
        country,
        parseFloat(minAvailability)
      )
        .then(team => {
          res.status(200).send({ authenticated: true, team });
        })
        .catch(err => {
          res.status(err.status).json({ error: err.message });
          console.error(err);
        });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
);

teamRouter.post(
  '/api/teams/addmember',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.userId || !req.params.teamId) return next();

    const userId: number = parseInt(req.params.userId, 10);
    const teamId: number = parseInt(req.params.teamId, 10);

    if (userId && teamId) {
      const activeUserId: number = getActiveUserId(req);

      if (!isTeamAdmin(activeUserId, teamId))
        res.status(401).json({ error: 'Unauthorized' });

      await TeamRepository.addTeamMember(userId, teamId);
      const members = await TeamRepository.getTeamMembers(teamId);
      const memberIds = members.map(member => member.id);

      if (memberIds.includes(userId)) {
        res.status(200).send({ authenticated: true, memberIds });
      } else {
        res.status(500).json({ error: 'Could not process' });
      }
    } else {
      res.status(422).json({ error: 'Unprocessable Entity' });
    }
  }
);

teamRouter.post(
  '/api/teams/deletemember',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.userId || !req.params.teamId) return next();

    const userId: number = parseInt(req.params.userId, 10);
    const teamId: number = parseInt(req.params.teamId, 10);

    if (userId && teamId) {
      const activeUserId: number = getActiveUserId(req);

      if (!isTeamAdmin(activeUserId, teamId))
        res.status(401).json({ error: 'Unauthorized' });

      const result = await TeamRepository.removeTeamMember(userId, teamId);

      if (result)
        res.status(200).json({
          authenticated: true,
          message: 'User successfully removed from team',
        });
      else res.status(500).json({ error: 'Could not process' });
    } else {
      res.status(422).json({ error: 'Unprocessable Entity' });
    }
  }
);

export default teamRouter;
