import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent {
  taskForm = this.formBuilder.group({
    caption: [''],
    description: [''],
    deadlineDate: [''],
    priority: [TaskPriority.Medium],
    assignee: [''],
    status: [TaskStatus.ToDo],
  });
  
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormComponent>
  ) {}

  cancel() {
    this.dialogRef.close();
  }
}
