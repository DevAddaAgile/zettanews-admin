import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { ButtonComponent } from '../../../ui/button/button.component';
import { ClickOutsideDirective } from '../../../../directive/out-side-directive';
import { isPlatformBrowser } from '@angular/common';

export interface Language {
  language: string;
  code: string;
  icon: string;
}

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss'],
    imports: [ClickOutsideDirective, ButtonComponent]
})
export class LanguagesComponent {

  public active: boolean = false;
  public languages: Language[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us'
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr'
    },
    {
      language: 'Indonesia',
      code: 'id',
      icon: 'id'
    },
    {
      language: 'Español',
      code: 'es',
      icon: 'es'
    },
  ]

  public selectedLanguage: Language = {
    language: 'English',
    code: 'en',
    icon: 'us'
  }

  constructor(private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object,) {
    if (isPlatformBrowser(this.platformId)) {
      let language = localStorage.getItem("language");
  
      if(language == null){
        this.translate.use(this.selectedLanguage.code);
      }else{
        this.selectedLanguage = JSON.parse(language);
        this.translate.use(this.selectedLanguage.code);
      }
    }
  }

  selectLanguage(language: any){
    this.active = false;
    this.translate.use(language.code);
    this.selectedLanguage = language;
    localStorage.setItem("language", JSON.stringify(this.selectedLanguage));
  }

  clickHeaderOnMobile(){
    this.active = !this.active
  }

  hideDropdown(){
    this.active = false;
  }

}
