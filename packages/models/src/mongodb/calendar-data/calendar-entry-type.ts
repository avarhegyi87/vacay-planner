export enum CalendarEntryTypeEnum {
  vacation = 'vacation',
  plannedVacation = 'planned vacation',
  halfDayVacation = 'half-day vacation',
  otherVacation = 'other vacation',
  unpaidLeave = 'unpaid leave',
  parentalLeave = 'parental leave',
  bereavement = 'bereavement',
  publicHoliday = 'public holiday',
  sickLeave = 'sick leave',
  education = 'education',
  homeOffice = 'home office',
  workAtOffice = 'work at office',
  workAtClient = 'work at client',
  task1 = 'task 1',
  task2 = 'task 2',
  task3 = 'task 3',
  task4 = 'task 4',
  EMPTY = 'EMPTY',
}

export interface ICalendarEntryInfo {
  name: CalendarEntryTypeEnum;
  sign: string;
  isAbsence: boolean;
  isVacation: boolean;
}

export const calendarEntryInfo: Array<ICalendarEntryInfo> = [
  { name: CalendarEntryTypeEnum.EMPTY, sign: '', isAbsence: false, isVacation: false },

  { name: CalendarEntryTypeEnum.vacation, sign: 'V', isAbsence: true, isVacation: true },
  { name: CalendarEntryTypeEnum.plannedVacation, sign: 'V?', isAbsence: true, isVacation: true },
  { name: CalendarEntryTypeEnum.halfDayVacation, sign: 'HV', isAbsence: true, isVacation: true },
  { name: CalendarEntryTypeEnum.otherVacation, sign: 'OV', isAbsence: true, isVacation: true },

  { name: CalendarEntryTypeEnum.unpaidLeave, sign: 'Unp', isAbsence: true, isVacation: false },
  { name: CalendarEntryTypeEnum.parentalLeave, sign: 'Par', isAbsence: true, isVacation: false },
  { name: CalendarEntryTypeEnum.bereavement, sign: 'Ber', isAbsence: true, isVacation: false },
  { name: CalendarEntryTypeEnum.publicHoliday, sign: 'PH', isAbsence: true, isVacation: false },
  { name: CalendarEntryTypeEnum.sickLeave, sign: 'S', isAbsence: true, isVacation: false },
  { name: CalendarEntryTypeEnum.education, sign: 'E', isAbsence: true, isVacation: false },

  { name: CalendarEntryTypeEnum.homeOffice, sign: 'HO', isAbsence: false, isVacation: false },
  { name: CalendarEntryTypeEnum.workAtOffice, sign: 'W@O', isAbsence: false, isVacation: false },
  { name: CalendarEntryTypeEnum.workAtClient, sign: 'W@C', isAbsence: false, isVacation: false },
  { name: CalendarEntryTypeEnum.task1, sign: '1', isAbsence: false, isVacation: false },
  { name: CalendarEntryTypeEnum.task2, sign: '2', isAbsence: false, isVacation: false },
  { name: CalendarEntryTypeEnum.task3, sign: '3', isAbsence: false, isVacation: false },
  { name: CalendarEntryTypeEnum.task4, sign: '4', isAbsence: false, isVacation: false },
];
