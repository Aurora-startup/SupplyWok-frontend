import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { HeaderContent } from '../header-content/header-content';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarMenuComponent, HeaderContent],
  template: `
    <div class="layout">
      <app-sidebar-menu></app-sidebar-menu>
      <div class="main-wrapper">
        <app-header-content></app-header-content>
        <main class="layout-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }
    .layout-content {
      flex: 1;
    }
  `]
})
export class LayoutComponent {}
