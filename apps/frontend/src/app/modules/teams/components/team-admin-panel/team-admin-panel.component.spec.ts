import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAdminPanelComponent } from './team-admin-panel.component';

describe('TeamAdminPanelComponent', () => {
  let component: TeamAdminPanelComponent;
  let fixture: ComponentFixture<TeamAdminPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamAdminPanelComponent],
    });
    fixture = TestBed.createComponent(TeamAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
