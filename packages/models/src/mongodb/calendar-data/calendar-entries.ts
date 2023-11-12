import { AllowedHolidays } from './allowed-holidays';
import { SingleEntry } from './single-entry';

export interface CalendarEntries {
  id: string;
  email: string;
  entries: Array<SingleEntry>;
  allowedHolidays?: Array<AllowedHolidays>;
}
