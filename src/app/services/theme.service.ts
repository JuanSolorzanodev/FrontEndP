import { DOCUMENT } from '@angular/common';
import { Injectable,Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
 

  constructor(@Inject(DOCUMENT) private document: Document) {
    
  }
  switchTheme (theme: string) { 
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement; 
    if (themeLink) { 
    themeLink.href = theme + '.css';
    }
  }
}