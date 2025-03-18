import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecruiterResponse, RecruiterStatus } from '../../models/recruiter-response.model';
import { EmailService } from '../../services/email.service';
import { RecruiterService } from '../../services/recruiter.service';

@Component({
  selector: 'app-email-sender',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import FormsModule for ngModel
  templateUrl: './email-sender.component.html',
  styleUrls: ['./email-sender.component.css']
})
export class EmailSenderComponent implements OnInit {
  selectedRecruiterIds: number[] = [];
  recruiters: RecruiterResponse[] = [];
  filteredRecruiters: RecruiterResponse[] = [];
  searchLocation: string = '';
  searchStatus: RecruiterStatus | '' = '';
  statuses = Object.values(RecruiterStatus);

  constructor(
    private emailService: EmailService,
    private recruiterService: RecruiterService
  ) {}

  ngOnInit(): void {
    this.loadRecruiters();
  }

  // Load all recruiters
  loadRecruiters(): void {
    this.recruiterService.getAllRecruiters().subscribe((data: RecruiterResponse[]) => {
      this.recruiters = data;
      this.filteredRecruiters = data; // Initialize filteredRecruiters with all recruiters
    });
  }

  // Filter recruiters based on search criteria
  onSearch(): void {
    this.filteredRecruiters = this.recruiters.filter((recruiter) => {
      const matchesLocation = this.searchLocation
        ? recruiter.location.toLowerCase().includes(this.searchLocation.toLowerCase())
        : true;
      const matchesStatus = this.searchStatus
        ? recruiter.status === this.searchStatus
        : true;
      return matchesLocation && matchesStatus;
    });
  }

  // Clear the search inputs and reset the filtered list
  clearSearch(): void {
    this.searchLocation = '';
    this.searchStatus = '';
    this.filteredRecruiters = this.recruiters;
  }

  // Check if a recruiter is selected
  isSelected(id: number): boolean {
    return this.selectedRecruiterIds.includes(id);
  }

  // Toggle selection of a recruiter
  toggleRecruiterSelection(id: number): void {
    const index = this.selectedRecruiterIds.indexOf(id);
    if (index === -1) {
      this.selectedRecruiterIds.push(id); // Add to selection
    } else {
      this.selectedRecruiterIds.splice(index, 1); // Remove from selection
    }
  }

  // Check if all recruiters are selected
  isAllSelected(): boolean {
    return this.filteredRecruiters.every((recruiter) =>
      this.selectedRecruiterIds.includes(recruiter.id)
    );
  }

  // Toggle selection of all recruiters
  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      // Deselect all
      this.selectedRecruiterIds = this.selectedRecruiterIds.filter(
        (id) => !this.filteredRecruiters.some((recruiter) => recruiter.id === id)
      );
    } else {
      // Select all
      this.filteredRecruiters.forEach((recruiter) => {
        if (!this.selectedRecruiterIds.includes(recruiter.id)) {
          this.selectedRecruiterIds.push(recruiter.id);
        }
      });
    }
  }

  sendEmails(): void {
    if (this.selectedRecruiterIds.length > 0) {
      this.emailService.sendEmailsToRecruiters(this.selectedRecruiterIds).subscribe({
        next: (response: string) => { // Handle plain text response
          alert(response); // Show success message
          this.selectedRecruiterIds = []; // Clear selection
        },
        error: (error) => {
          console.error('Error sending emails:', error);
          alert('Failed to send emails. Please try again.');
        }
      });
    } else {
      alert('Please select at least one recruiter.');
    }
  }
}