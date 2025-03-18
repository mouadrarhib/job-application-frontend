import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecruiterResponse, RecruiterStatus } from '../../models/recruiter-response.model';
import { RecruiterService } from '../../services/recruiter.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruiter-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Import FormsModule for ngModel
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

  // Load all recruiters or filtered recruiters
  loadRecruiters(): void {
    if (this.searchLocation || this.searchStatus) {
      // Perform search if location or status is provided
      this.recruiterService
        .searchByCompanyStatusAndLocation('', this.searchStatus || RecruiterStatus.CONTACTED, this.searchLocation)
        .subscribe((data) => {
          this.recruiters = data;
        });
    } else {
      // Load all recruiters if no search criteria
      this.recruiterService.getAllRecruiters().subscribe((data) => {
        this.recruiters = data;
      });
    }
  }

  // Triggered when the user types in the search input or selects a status
  onSearch(): void {
    this.loadRecruiters();
  }

  // Clear the search inputs and reload all recruiters
  clearSearch(): void {
    this.searchLocation = '';
    this.searchStatus = '';
    this.loadRecruiters();
  }

  // Delete a recruiter
  deleteRecruiter(id: number): void {
    if (confirm('Are you sure you want to delete this recruiter?')) {
      this.recruiterService.deleteRecruiter(id).subscribe({
        next: () => {
          this.loadRecruiters(); // Refresh the list after deletion
        },
        error: (error) => {
          console.error('Error deleting recruiter:', error);
        }
      });
    }
  }
}