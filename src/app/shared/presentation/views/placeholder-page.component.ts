import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  template: `
    <section class="placeholder-page">
      <span class="placeholder-page__kicker">SupplyWok</span>
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </section>
  `,
  styles: [`
    .placeholder-page {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 24px;
      border-radius: 18px;
      background: #fffdf9;
      box-shadow: 0 14px 34px rgba(45, 36, 30, 0.08);
    }

    .placeholder-page__kicker {
      color: #a07832;
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
  `]
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = this.route.snapshot.data['title'] ?? 'Placeholder';
  protected readonly description = this.route.snapshot.data['description'] ?? 'This page is under construction.';
}
