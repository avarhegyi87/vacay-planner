import { NextFunction, Request, Response, Router } from 'express';
import { getActiveUserId, isAuthenticated, isMember } from '../middlewares';
import CalendarRepository from '../mongodb/repositories/calendar.repository';

const calendarRouter = Router();

calendarRouter.get(
  '/get',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const currentUser: number = getActiveUserId(req);
      if (!currentUser) return res.status(401).json({ error: 'Unauthorized' });

      const { userId, teamId, year, month } = req.query;

      if (!(userId && teamId && year && month)) {
        return res.status(422).json({
          error: 'Missing parameters. Requires: userId, teamId, year, month (as numbers)',
        });
      }

      const isTeamMember: boolean = await isMember(+userId, +teamId);
      if (!isTeamMember) {
        return res
          .status(401)
          .json({ error: `user ${userId} is not a member of team ${teamId}` });
      }

      return await CalendarRepository.getMonhlyCalendarEntries(
        +userId,
        +year,
        +month
      )
        .then(entries => {
          console.debug(`entries for ${userId}:`, entries)
          return res.status(200).json(entries);
        })
        .catch(error => {
          console.error(
            `Error while getting monthly calendar entry for ${userId}:`,
            error
          );
          return res.status(error.status || 500).json({
            error: error.message,
            stack:
              process.env.NODE_ENV === 'development' ? error.stack : undefined,
          });
        });
    } catch (error: any) {
      console.error('Error while getting monthly calendar entry:', error);
      return res.status(error.status || 500).json({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }
);

calendarRouter.post(
  '/update',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const userId: number = getActiveUserId(req);

      const { teamId, year, entries } = req.body;

      const isAuthorized: boolean = await isMember(userId, teamId);

      if (!isAuthorized) return res.status(401).json({ error: 'Unauthorized' });

      if (year && entries) {
        return await CalendarRepository.updateCalendarEntry(
          userId,
          year,
          entries
        )
          .then(cal => {
            return res.status(200).json(cal);
          })
          .catch(err => {
            res.status(err.status || 500).json({
              error: err.message,
              stack:
                process.env.NODE_ENV === 'development' ? err.stack : undefined,
            });
          });
      } else {
        console.error('Unsuccessful calendar update');
        return res.status(422).json({ error: 'Unprocessable Entity' });
      }
    } catch (error: any) {
      console.error('Error in calendar update:', error);
      return res.status(error.status | 500).json({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  }
);

export default calendarRouter;
