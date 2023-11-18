import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter, switchMap } from 'rxjs';
import { CountryApiService } from 'src/app/shared/services/country-api.service';
import { TeamService } from '../../services/team.service';
import { CalendarEntryTypeEnum, ICalendarEntryInfo, SingleEntry, Team, calendarEntryInfo } from '@vacay-planner/models';

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.scss'],
})
export class ViewTeamComponent implements OnInit, OnDestroy {
  subscriptions: Array<Subscription> = [];
  publicHolidays: Array<any> = [];
  currentUserId: number | undefined;
  teamId: number | null | undefined;
  team: Team | undefined;
  members: Array<{ id: number; username: string; currentUser: boolean }> = [];
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  dates: Array<Date> = [];
  entryTypes: Array<ICalendarEntryInfo> = [];
  selectedEntryType: ICalendarEntryInfo | null = null;
  registeredCalendarEntries: Array<SingleEntry> = [];
  smallScreen!: boolean;

  constructor(private route: ActivatedRoute, private teamService: TeamService, private countryApiService: CountryApiService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        this.year = parseInt(params.get('year') || '') || new Date().getFullYear();
        this.month = parseInt(params.get('month') || '') || new Date().getMonth() + 1;
        this.dates = this.getDatesOfMonth();

        this.teamId = parseInt(params.get('id') || '', 10) || null;

        if (this.teamId) {
          this.subscriptions.push(
            this.teamService
              .getTeamInfo(this.teamId)
              .pipe(
                filter((team) => !!team),
                switchMap((team: Team) => {
                  this.team = team;
                  if (team) {
                    this.subscriptions.push(
                      this.teamService.getMembers(this.teamId!).subscribe((ppl) => {
                        this.members = ppl;
                        this.sortMembers();
                      })
                    );
                  }
                  if (team && team.country) {
                    return this.countryApiService.getPublicHolidays(this.year, team.country!);
                  } else {
                    return [];
                  }
                })
              )
              .subscribe((holidays: Array<any>) => {
                this.publicHolidays = holidays.filter((h) => new Date(h.date).getMonth() + 1 === this.month);
              })
          );
        }
      })
    );

    this.smallScreen = window.screen.width < 922;
    this.entryTypes = calendarEntryInfo;
  }

  getDatesOfMonth(): Array<Date> {
    const lastDayOfMonth: number = new Date(this.year, this.month, 0).getDate();
    let dates = [];
    for (let day = 1; day <= lastDayOfMonth; day++) {
      dates.push(new Date(this.year, this.month - 1, day));
    }
    return dates;
  }

  getMonthName(monthNum: number): string {
    return new Date(this.year, monthNum - 1, 1).toLocaleString('en-US', {
      month: 'short',
    });
  }

  isCurrentMonth(monthNum: number): boolean {
    return this.year === new Date().getFullYear() && monthNum - 1 === new Date().getMonth();
  }

  get currentDate(): Date {
    return new Date();
  }

  isToday(date: Date): boolean {
    return this.areDatesEqual(this.currentDate, date);
  }

  areDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }

  isPublicHoliday(date: Date): boolean {
    return this.publicHolidays.some(
      (h) =>
        new Date(h.date).getFullYear() === date.getFullYear() &&
        new Date(h.date).getMonth() === date.getMonth() &&
        new Date(h.date).getDate() === date.getDate()
    );
  }

  sortMembers(): void {
    const currentUser = this.members.find((u) => u.currentUser);
    const otherMembers = this.members.filter((u) => u.id !== currentUser?.id);

    otherMembers.sort((a, b) => a.username.localeCompare(b.username));
    this.members = currentUser ? [currentUser, ...otherMembers] : otherMembers;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.smallScreen = window.innerWidth < 922;
  }

  get visibleMonthList() {
    return this.smallScreen ? [this.month] : Array.from({ length: 12 }, (_, i) => i + 1);
  }

  onSelectChange(event: any): void {
    this.selectedEntryType = this.entryTypes.find((e) => e.sign === event.target.value) || null;
  }

  getEntryType(userId: number, date: Date): string | null {
    const entryName = this.registeredCalendarEntries.find((e) => this.areDatesEqual(e.entryDate, date))?.entryType || null;
    return calendarEntryInfo.find(e => e.name === entryName)?.sign || null
  }

  writeInfoIntoTable(userId: number, date: Date): void {
    if (this.selectedEntryType) {
      const entry: SingleEntry | undefined = this.registeredCalendarEntries.find((e) => this.areDatesEqual(e.entryDate, date));
      if (entry) {
        if (this.selectedEntryType?.name === CalendarEntryTypeEnum.EMPTY) {
          this.registeredCalendarEntries = this.registeredCalendarEntries.filter((e) => !this.areDatesEqual(e.entryDate, date));
        } else {
          entry.entryType = this.selectedEntryType.name;
        }
      } else {
        this.registeredCalendarEntries.push({
          entryDate: new Date(this.year, this.month - 1, date.getDate()),
          entryType: this.selectedEntryType?.name,
        });
        this.registeredCalendarEntries.sort((a, b) => a.entryDate.getTime() - b.entryDate.getTime());
      }
    }

    console.log(this.registeredCalendarEntries);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
