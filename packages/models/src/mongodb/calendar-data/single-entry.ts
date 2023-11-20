import { CalendarEntryTypeEnum } from './calendar-entry-type';

export interface SingleEntry {
  entryDate: Date,
  entryType: CalendarEntryTypeEnum;
}
