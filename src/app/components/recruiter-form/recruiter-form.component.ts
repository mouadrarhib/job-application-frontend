import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecruiterService } from '../../services/recruiter.service';
import { Language, RecruiterStatus } from '../../models/recruiter-response.model';
import { RecruiterRequest } from '../../models/recruiter-request.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink], // Add necessary modules here
  templateUrl: './recruiter-form.component.html',
  styleUrls: ['./recruiter-form.component.css']
})
export class RecruiterFormComponent implements OnInit {
  recruiterForm: FormGroup;
  languages = Object.values(Language);
  statuses = Object.values(RecruiterStatus);
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private recruiterService: RecruiterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recruiterForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      jobTitle: ['', Validators.required],
      location: ['', Validators.required],
      language: [Language.EN, Validators.required],
      status: [RecruiterStatus.CONTACTED, Validators.required],
      feedback: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.recruiterService.getRecruiterById(this.id).subscribe((recruiter) => {
        this.recruiterForm.patchValue(recruiter);
      });
    }
  }

  onSubmit(): void {
    if (this.recruiterForm.valid) {
      const recruiterRequest: RecruiterRequest = this.recruiterForm.value;
      if (this.id) {
        this.recruiterService.updateRecruiter(this.id, recruiterRequest).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error updating recruiter:', error);
          }
        });
      } else {
        this.recruiterService.createRecruiter(recruiterRequest).subscribe({
          next: () => {
            this.router.navigate(['/recruiters']);
          },
          error: (error) => {
            console.error('Error creating recruiter:', error);
          }
        });
      }
    }
  }
}