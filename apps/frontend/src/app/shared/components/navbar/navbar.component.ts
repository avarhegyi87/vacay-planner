import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription, tap } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('navbarToggler')
  navbarToggler!: HTMLElement;

  isCollapsed = true;
  loading: boolean = true;
  isAuthenticated: boolean = false;
  private authSubscription: Subscription = new Subscription();
  userName = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuth) => {
        this.isAuthenticated = isAuth;
        this.loading = false;
        this.cdr.detectChanges();
      }
    );

    this.authService
      .getUser()
      .subscribe((user) => (this.userName = user.username));

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) this.isCollapsed = true;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onLogout() {
    this.authService
      .logout()
      .pipe(
        tap({
          next: () => {
            this.userName = '';
            this.router.navigate(['/']);
          },
          error: (err) => console.error('Logout failed:', err),
        })
      )
      .subscribe();
  }

  get isNavbarTogglerVisible(): boolean {
    return (
      this.navbarToggler &&
      this.navbarToggler.offsetWidth > 0 &&
      this.navbarToggler.offsetHeight > 0
    );
  }
}
