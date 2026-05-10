import { Component, signal } from '@angular/core';
import { SidebarMenuComponent } from './shared/presentation/components/sidebar-menu/sidebar-menu.component';
import { LanguageSwitcher } from './shared/presentation/components/language-switcher/language-switcher';
import { HeaderContent} from './shared/presentation/components/header-content/header-content';

@Component({
  selector: 'app-root',
  imports: [SidebarMenuComponent, LanguageSwitcher, HeaderContent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SupplyWok-frontend');
}
