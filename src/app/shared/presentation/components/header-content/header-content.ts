import { Component, inject, OnInit } from '@angular/core';
import { MenuModule} from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-content',
  standalone: true,
  imports: [MenuModule, LanguageSwitcher, TranslateModule],
  templateUrl: './header-content.html',
  styleUrl: './header-content.css',
})
export class HeaderContent implements OnInit {
  profileItems: MenuItem[] = [];
  private translate = inject(TranslateService);

  ngOnInit() {
    this.updateMenuTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.updateMenuTranslations();
    });
  }

  private updateMenuTranslations() {
    this.translate.get(['shared.header.options', 'shared.header.settings', 'shared.header.logout']).subscribe(translations => {
      this.profileItems = [
        { 
          label: translations['shared.header.options'] || 'Options',
          items: [
            { label: translations['shared.header.settings'] || 'Settings', icon: 'pi pi-cog' },
            { label: translations['shared.header.logout'] || 'Logout', icon: 'pi pi-sign-out' }
          ]
        }
      ];
    });
  }
}
