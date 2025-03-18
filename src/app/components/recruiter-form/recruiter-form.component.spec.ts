import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterFormComponent } from './recruiter-form.component';

describe('RecruiterFormComponent', () => {
  let component: RecruiterFormComponent;
  let fixture: ComponentFixture<RecruiterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
