import { jest } from '@jest/globals';
import { CalendarEntries, CalendarEntryTypeEnum } from '@vacay-planner/models';
import CalendarModel from '../models/calendar.model';
import CalendarRepository from './calendar.repository';
import { Query } from 'mongoose';

jest.mock('../models/calendar.model', () => ({
  findOne: jest.fn() as jest.Mock,
  exec: jest.fn(),
}));
const findOneSpy = jest.spyOn(CalendarModel, 'findOne');

describe('CalendarRepository', () => {

  describe('getCalByUserAndYear', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should return a document', async () => {
      const mockCalendarEntry: CalendarEntries = {
        id: '1_2024',
        email: 'user@gmail.com',
        allowedHolidays: [{ year: 2024, holidays: 25 }],
        entries: [
          { entryDate: new Date(2024, 1, 16), entryType: CalendarEntryTypeEnum.vacation },
          { entryDate: new Date(2024, 2, 13), entryType: CalendarEntryTypeEnum.vacation },
        ],
      };

      findOneSpy.mockReturnThis();
      findOneSpy.mockReturnValue({
        exec: jest.fn().mockReturnValue(mockCalendarEntry),
      } as unknown as Query<CalendarEntries, any>);

      const result = await CalendarRepository.getCalByUserAndYear('1', 2024);

      const execSpy = jest.spyOn(<Query<CalendarEntries, any>>findOneSpy.mock.results[0].value, 'exec');

      expect(result).toStrictEqual(mockCalendarEntry);
      expect(findOneSpy).toHaveBeenCalledWith({ id: '1_2024' });
      expect(execSpy).toHaveBeenCalled();
    });

    test('should return null', async () => {
      findOneSpy.mockReturnThis();
      findOneSpy.mockReturnValue({
        exec: jest.fn().mockReturnValue(null),
      } as unknown as Query<CalendarEntries, any>);

      const result = await CalendarRepository.getCalByUserAndYear('1', 2024);

      const execSpy = jest.spyOn(<Query<CalendarEntries, any>>findOneSpy.mock.results[0].value, 'exec');

      expect(result).toBeNull();
      expect(findOneSpy).toHaveBeenCalledWith({ id: '1_2024' });
      expect(execSpy).toHaveBeenCalled();
    });
  });
});