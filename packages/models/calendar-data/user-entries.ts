import { AllowedHolidays } from './allowed-holidays';
import { YearlyEntries } from './yearly-entries';

export interface UserEntries {
  userId: string;
  allowedHolidays?: Array<AllowedHolidays>;
  vacations?: Array<YearlyEntries>;
  halfDayVacations?: Array<YearlyEntries>;
  homeOffices?: Array<YearlyEntries>;
  sicknesses?: Array<YearlyEntries>;
  workAtOffice?: Array<YearlyEntries>;
  workAtClientSite?: Array<YearlyEntries>;
}
