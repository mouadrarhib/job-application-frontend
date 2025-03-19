import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterResponse, RecruiterStatus } from '../../models/recruiter-response.model';
import { RecruiterService } from '../../services/recruiter.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruiter-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recruiter-list.component.html',
  styleUrls: ['./recruiter-list.component.css']
})
export class RecruiterListComponent implements OnInit {
  recruiters: RecruiterResponse[] = [];
  searchLocation: string = '';
  searchStatus: RecruiterStatus | '' = '';
  statuses = Object.values(RecruiterStatus);

  constructor(private recruiterService: RecruiterService) {}

  ngOnInit(): void {
    this.loadRecruiters();
  }

  loadRecruiters(): void {
    if (this.searchLocation || this.searchStatus) {
      this.recruiterService
        .searchByCompanyStatusAndLocation('', this.searchStatus || RecruiterStatus.CONTACTED, this.searchLocation)
        .subscribe({
          next: (data) => {
            this.recruiters = data || [];
          },
          error: (error) => {
            console.error('Error loading recruiters:', error);
            this.recruiters = [];
          }
        });
    } else {
      this.recruiterService.getAllRecruiters().subscribe({
        next: (data) => {
          this.recruiters = data || [];
        },
        error: (error) => {
          console.error('Error loading recruiters:', error);
          this.recruiters = [];
        }
      });
    }
  }

  onSearch(): void {
    this.loadRecruiters();
  }

  clearSearch(): void {
    this.searchLocation = '';
    this.searchStatus = '';
    this.loadRecruiters();
  }

  deleteRecruiter(id: number): void {
    if (confirm('Are you sure you want to delete this recruiter?')) {
      this.recruiterService.deleteRecruiter(id).subscribe({
        next: () => {
          this.loadRecruiters();
        },
        error: (error) => {
          console.error('Error deleting recruiter:', error);
        }
      });
    }
  }
}