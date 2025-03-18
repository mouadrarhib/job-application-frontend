import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecruiterRequest } from '../models/recruiter-request.model';
import { RecruiterResponse } from '../models/recruiter-response.model';
import { Language, RecruiterStatus } from '../models/recruiter-response.model';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {
  private apiUrl = 'http://localhost:8088/api/v1/recruiters';

  constructor(private http: HttpClient) { }

  // Create a new recruiter
  createRecruiter(recruiterRequest: RecruiterRequest): Observable<RecruiterResponse> {
    return this.http.post<RecruiterResponse>(this.apiUrl, recruiterRequest);
  }

  // Update an existing recruiter
  updateRecruiter(id: number, recruiterRequest: RecruiterRequest): Observable<RecruiterResponse> {
    return this.http.put<RecruiterResponse>(`${this.apiUrl}/${id}`, recruiterRequest);
  }

  // Get all recruiters
  getAllRecruiters(): Observable<RecruiterResponse[]> {
    return this.http.get<RecruiterResponse[]>(this.apiUrl);
  }

  // Get a recruiter by ID
  getRecruiterById(id: number): Observable<RecruiterResponse> {
    return this.http.get<RecruiterResponse>(`${this.apiUrl}/${id}`);
  }

  // Delete a recruiter by ID
  deleteRecruiter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search recruiters by company
  searchByCompany(company: string): Observable<RecruiterResponse[]> {
    return this.http.get<RecruiterResponse[]>(`${this.apiUrl}/search/company?company=${company}`);
  }

  // Search recruiters by status
  searchByStatus(status: RecruiterStatus): Observable<RecruiterResponse[]> {
    return this.http.get<RecruiterResponse[]>(`${this.apiUrl}/search/status?status=${status}`);
  }

  // Search recruiters by location
  searchByLocation(location: string): Observable<RecruiterResponse[]> {
    return this.http.get<RecruiterResponse[]>(`${this.apiUrl}/search/location?location=${location}`);
  }

  // Search recruiters by company, status, and location
  searchByCompanyStatusAndLocation(
    company: string,
    status: RecruiterStatus,
    location: string
  ): Observable<RecruiterResponse[]> {
    return this.http.get<RecruiterResponse[]>(
      `${this.apiUrl}/search?company=${company}&status=${status}&location=${location}`
    );
  }

  // Search recruiter IDs by location and status
  searchRecruiterIdsByLocationAndStatus(
    location: string,
    status: RecruiterStatus
  ): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/search/ids?location=${location}&status=${status}`
    );
  }

  // Search recruiter IDs by location
  searchRecruiterIdsByLocation(location: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/search/ids/location?location=${location}`);
  }

  // Search recruiter IDs by status
  searchRecruiterIdsByStatus(status: RecruiterStatus): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/search/ids/status?status=${status}`);
  }
}