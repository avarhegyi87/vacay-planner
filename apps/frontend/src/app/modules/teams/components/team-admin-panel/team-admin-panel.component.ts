import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-team-admin-panel',
  templateUrl: './team-admin-panel.component.html',
  styleUrls: ['./team-admin-panel.component.scss'],
})
export class TeamAdminPanelComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() addMemberEvent: EventEmitter<string> = new EventEmitter();
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, private teamService: TeamService) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/)])],
    });
  }

  isValid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return control.valid && (control.dirty || control.touched);
  }

  isInvalid(fieldName: string) {
    const control = this.formGroup.controls[fieldName];
    return control.invalid && (control.dirty || control.touched);
  }

  onAddMember() {
    if (this.formGroup.invalid) return;

    this.addMemberEvent.emit(this.formGroup.controls['email'].value);
    this.formGroup.reset();
  }
}
