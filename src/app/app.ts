import { Component, signal } from '@angular/core';
import { SidebarMenuComponent } from './shared/presentation/sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-root',
  imports: [SidebarMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SupplyWok-frontend');
}
