import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenuComponent } from './shared/presentation/components/sidebar-menu/sidebar-menu.component';
import { HeaderContent} from './shared/presentation/components/header-content/header-content';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarMenuComponent, HeaderContent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SupplyWok-frontend');
}
