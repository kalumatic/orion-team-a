import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-incident-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './incident-dialog.html',
  styleUrl: './incident-dialog.css'
})
export class IncidentDialog {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncidentDialog>
  ) {
    this.form = this.fb.group({
      reporter: ['', Validators.required],
      device: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      severity: ['Low'],
      status: ['Open']
    });
  }

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}