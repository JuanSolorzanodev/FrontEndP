import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {
  private apiUrl = 'https://gist.githubusercontent.com/gugazimmermann/6b046821c7c695270d4dee7acb6fa924/raw/b431ac7642ca76e16620fa172c77ec97ff21dada/phone-code-es.json';

  constructor(private http: HttpClient) {}

  getCountryCodes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
