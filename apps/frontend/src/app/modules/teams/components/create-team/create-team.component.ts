import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CountryApiService } from '../../../../shared/services/country-api.service';
import { Subscription, first, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-create-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss'],
})
export class CreateTeamComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  subscriptions: Array<Subscription> = [];
  countries: Array<any> = [];
  currentMinAvailability = 0;

  constructor(
    private formBuilder: FormBuilder,
    private countryApiService: CountryApiService,
    private cdr: ChangeDetectorRef,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.countryApiService
        .getCountryList()
        .subscribe((countryList: Array<any>) => {
          this.countries = countryList.sort((a, b) => {
            const nameA = a.name.common.toUpperCase();
            const nameB = b.name.common.toUpperCase();

            if (nameA < nameB) return -1;
            else if (nameA > nameB) return 1;
            else return 0;
          });
          this.cdr.detectChanges();
        })
    );

    this.formGroup = this.formBuilder.group({
      teamName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      country: ['', Validators.compose([Validators.required])],
      minAvailability: [
        0,
        Validators.compose([Validators.min(0), Validators.max(100)]),
      ],
    });
  }

  onKeyDown(event: { keyCode: number }) {
    if (event.keyCode === 13) this.onSubmit();
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    this.teamService
      .addTeam({
        teamName: this.formGroup.controls['teamName'].value,
        countryCode: this.formGroup.controls['country'].value,
        minAvailability: this.formGroup.controls['minAvailability'].value
          ? this.formGroup.controls['minAvailability'].value / 100
          : undefined,
      })
      .pipe(first())
      .subscribe({
        next: (team) => console.log('Successfully created team, id: ', team),
        error: (err) => console.error('ERROR:', err),
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
