import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8088/api/v1/emails';

  constructor(private http: HttpClient) { }

  // Send emails to multiple recruiters by their IDs
  sendEmailsToRecruiters(recruiterIds: number[]): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/send`, recruiterIds, {
      headers: headers,
      responseType: 'text' // Expect a plain text response
    });
  }
}