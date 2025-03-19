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
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './recruiter-form.component.html',
  styleUrls: ['./recruiter-form.component.css']
})
export class RecruiterFormComponent implements OnInit {
  recruiterForm: FormGroup;
  languages = Object.values(Language);
  statuses = Object.values(RecruiterStatus);
  id: number | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private recruiterService: RecruiterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recruiterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      jobTitle: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      language: [Language.EN, Validators.required],
      status: [RecruiterStatus.CONTACTED, Validators.required],
      feedback: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.id = parseInt(idParam, 10);
      this.loadRecruiter();
    }
  }

  loadRecruiter(): void {
    if (this.id) {
      this.recruiterService.getRecruiterById(this.id).subscribe({
        next: (recruiter) => {
          this.recruiterForm.patchValue(recruiter);
        },
        error: (error) => {
          console.error('Error loading recruiter:', error);
          this.router.navigate(['/']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.recruiterForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const recruiterRequest: RecruiterRequest = this.recruiterForm.value;

      const request$ = this.id
        ? this.recruiterService.updateRecruiter(this.id, recruiterRequest)
        : this.recruiterService.createRecruiter(recruiterRequest);

      request$.subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error saving recruiter:', error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.recruiterForm.controls).forEach(key => {
        const control = this.recruiterForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}