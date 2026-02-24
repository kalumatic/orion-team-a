import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './device-dialog.html',
  styleUrl: './device-dialog.css'
})
export class DeviceDialog implements OnInit {

  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeviceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [null],
      deviceType: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;

      this.form.patchValue({
        id: this.data.id ?? null,
        deviceType: this.data.deviceType ?? '',
        model: this.data.model ?? '',
        serialNumber: this.data.serialNumber ?? '',
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}