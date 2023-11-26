import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  subscriptions: Array<Subscription> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          console.log('urlAfterRedirects:', event.urlAfterRedirects);
          if (event.urlAfterRedirects === '/login') {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
