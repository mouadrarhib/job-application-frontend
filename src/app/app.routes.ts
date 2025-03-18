import { Routes } from '@angular/router';
import { RecruiterListComponent } from './components/recruiter-list/recruiter-list.component';
import { RecruiterFormComponent } from './components/recruiter-form/recruiter-form.component';
import { EmailSenderComponent } from './components/email-sender/email-sender.component';

export const routes: Routes = [
    { path: '', component: RecruiterListComponent },
    { path: 'add', component: RecruiterFormComponent },
    { path: 'edit/:id', component: RecruiterFormComponent },
    { path: 'send-emails', component: EmailSenderComponent }
];
