import { Component, signal } from '@angular/core';
import { SidebarMenuComponent } from './shared/presentation/components/sidebar-menu/sidebar-menu.component';
import { LanguageSwitcher } from './shared/presentation/components/language-switcher/language-switcher';
import { HeaderContent} from './shared/presentation/components/header-content/header-content';
import { LowStockCard } from './iot-monitoring/presentation/components/low-stock-card/low-stock-card';
import { TempAlertCard } from './iot-monitoring/presentation/components/temp-alert-card/temp-alert-card';
import { ActiveTablesCard } from './iot-monitoring/presentation/components/active-tables-card/active-tables-card';
import { IotPanelCard } from './iot-monitoring/presentation/components/iot-panel-card/iot-panel-card';

@Component({
  selector: 'app-root',
  imports: [
    SidebarMenuComponent, LanguageSwitcher, HeaderContent, 
    LowStockCard, TempAlertCard, ActiveTablesCard,
    IotPanelCard
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SupplyWok-frontend');
}
