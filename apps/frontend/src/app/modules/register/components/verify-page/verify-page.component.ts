import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-verify-page',
  templateUrl: './verify-page.component.html',
  styleUrls: ['./verify-page.component.scss'],
})
export class VerifyPageComponent implements OnInit {
  success: boolean = false;
  content = '';
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const success: string = params['success'];
      const error: string = params['error'];

      this.success = success === 'true';

      if (success === 'true') {
        this.content = 'Successful verification! Enjoy the app.';
        setTimeout(() => {
          this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
            if (isAuthenticated) this.router.navigate(['/']).then(() => window.location.reload());
            else this.router.navigate(['/login']);
          });
        }, 2000);
      } else {
        if (error === 'TokenExpired') {
          this.content = 'Token expired. Resend the token.';
        } else if (error === 'TokenNotFound') {
          this.content = 'User account not found. Try registering again.';
        } else {
          this.content = 'Something went wrong. Try registering again.';
        }
        setTimeout(() => {
          this.router.navigate(['/register']);
        }, 5000);
      }
    });
  }
}
