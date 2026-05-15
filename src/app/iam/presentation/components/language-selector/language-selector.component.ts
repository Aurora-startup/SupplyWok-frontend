import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface Language {
  name: string;
  code: string;
  icon: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule, SelectModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  languages: Language[] = [
    { name: 'English (US)', code: 'en', icon: 'assets/images/icons/selector-iam/en-selector-icon.svg' },
    { name: 'Spanish (ES)', code: 'es', icon: 'assets/images/icons/selector-iam/es-selector-icon.svg' },
    { name: 'Chinese (ZH)', code: 'zh', icon: 'assets/images/icons/selector-iam/zh-selector-icon.svg' }
  ];

  selectedLanguage: Language;

  constructor(private translate: TranslateService) {
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'en';
    this.selectedLanguage = this.languages.find(lang => lang.code === currentLang) || this.languages[0];
  }

  onLanguageChange(event: any): void {
    if (event.value) {
      this.translate.use(event.value.code);
    }
  }
}
