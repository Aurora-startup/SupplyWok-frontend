import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink],
  template: `
    <section class="not-found-page">
      <span class="not-found-page__kicker">404</span>
      <h1>Page not found</h1>
      <p>The requested route does not exist in this frontend version.</p>
      <a routerLink="/orders" class="not-found-page__link">Go to orders</a>
    </section>
  `,
  styles: [`
    .not-found-page {
      display: grid;
      gap: 10px;
      max-width: 520px;
      padding: 32px;
      border-radius: 18px;
      background: #fffdf9;
      box-shadow: 0 14px 34px rgba(45, 36, 30, 0.08);
    }

    .not-found-page__kicker {
      color: #c21204;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: #342923;
    }

    p {
      margin: 0;
      color: #65594f;
    }

    .not-found-page__link {
      width: fit-content;
      padding: 10px 14px;
      border-radius: 12px;
      background: #2d241e;
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class PageNotFoundComponent {}
