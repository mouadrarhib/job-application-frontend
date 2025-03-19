import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { RecruiterResponse, RecruiterStatus } from '../../models/recruiter-response.model';
import { EmailService } from '../../services/email.service';
import { RecruiterService } from '../../services/recruiter.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-email-sender',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollingModule],
  templateUrl: './email-sender.component.html',
  styleUrls: ['./email-sender.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailSenderComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  selectedRecruiterIds: Set<number> = new Set();
  recruiters: RecruiterResponse[] = [];
  filteredRecruiters: RecruiterResponse[] = [];
  searchLocation$ = new BehaviorSubject<string>('');
  searchStatus$ = new BehaviorSubject<RecruiterStatus | ''>('');
  statuses = Object.values(RecruiterStatus);
  
  readonly itemSize = 60; // Height of each item in pixels
  readonly pageSize = 50; // Number of items to load at once
  isLoading = false;

  constructor(
    private emailService: EmailService,
    private recruiterService: RecruiterService
  ) {
    // Setup debounced search
    this.searchLocation$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.onSearch());

    this.searchStatus$.pipe(
      distinctUntilChanged()
    ).subscribe(() => this.onSearch());
  }

  ngOnInit(): void {
    this.loadRecruiters();
  }

  // Load recruiters with pagination
  loadRecruiters(): void {
    this.isLoading = true;
    this.recruiterService.getAllRecruiters().subscribe({
      next: (data: RecruiterResponse[]) => {
        this.recruiters = data;
        this.filteredRecruiters = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recruiters:', error);
        this.isLoading = false;
      }
    });
  }

  // Optimized search with debounce
  onSearch(): void {
    const searchLocation = this.searchLocation$.value.toLowerCase();
    const searchStatus = this.searchStatus$.value;

    this.filteredRecruiters = this.recruiters.filter((recruiter) => {
      const matchesLocation = !searchLocation || 
        recruiter.location.toLowerCase().includes(searchLocation);
      const matchesStatus = !searchStatus || 
        recruiter.status === searchStatus;
      return matchesLocation && matchesStatus;
    });
  }

  // Update search terms
  updateSearchLocation(value: string): void {
    this.searchLocation$.next(value);
  }

  updateSearchStatus(value: RecruiterStatus | ''): void {
    this.searchStatus$.next(value);
  }

  // Clear search with optimized handling
  clearSearch(): void {
    this.searchLocation$.next('');
    this.searchStatus$.next('');
    this.filteredRecruiters = this.recruiters;
  }

  // Optimized selection handling using Set
  isSelected(id: number): boolean {
    return this.selectedRecruiterIds.has(id);
  }

  toggleRecruiterSelection(id: number): void {
    if (this.selectedRecruiterIds.has(id)) {
      this.selectedRecruiterIds.delete(id);
    } else {
      this.selectedRecruiterIds.add(id);
    }
  }

  isAllSelected(): boolean {
    return this.filteredRecruiters.length > 0 && 
           this.filteredRecruiters.every(recruiter => 
             this.selectedRecruiterIds.has(recruiter.id)
           );
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.filteredRecruiters.forEach(recruiter => 
        this.selectedRecruiterIds.delete(recruiter.id)
      );
    } else {
      this.filteredRecruiters.forEach(recruiter => 
        this.selectedRecruiterIds.add(recruiter.id)
      );
    }
  }

  // Batch process emails
  sendEmails(): void {
    if (this.selectedRecruiterIds.size > 0) {
      const selectedIds = Array.from(this.selectedRecruiterIds);
      this.emailService.sendEmailsToRecruiters(selectedIds).subscribe({
        next: (response: string) => {
          alert(response);
          this.selectedRecruiterIds.clear();
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

  // Track items for better performance
  trackByFn(index: number, item: RecruiterResponse): number {
    return item.id;
  }
}