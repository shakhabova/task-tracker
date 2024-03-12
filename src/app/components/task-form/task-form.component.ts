import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

interface SelectOption<T = string> {
  label: string;
  value: T;
}

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
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  providers: [provideNativeDateAdapter()],
})
export class TaskFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private data?: Task = inject(MAT_DIALOG_DATA);

  taskForm = this.formBuilder.group({
    caption: ['', Validators.required],
    description: ['', Validators.required],
    deadlineDate: ['', Validators.required],
    priority: [TaskPriority.Medium, Validators.required],
    assignee: ['', Validators.required],
    status: ['to_do', Validators.required],
  });

  priorityOptions: SelectOption<TaskPriority>[] = [
    { label: 'Lowest', value: TaskPriority.Lowest },
    { label: 'Low', value: TaskPriority.Low },
    { label: 'Medium', value: TaskPriority.Medium },
    { label: 'High', value: TaskPriority.High },
    { label: 'Highest', value: TaskPriority.Highest },
  ];
  statusOptions: SelectOption<TaskStatus>[] = [
    { label: 'To Do', value: TaskStatus.ToDo },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Done', value: TaskStatus.Done },
  ];

  ngOnInit(): void {
    if (this.isEdit) {
      this.taskForm.patchValue(this.data!);
    }
  }

  get isEdit(): boolean {
    return !!this.data;
  }

  get title(): string {
    return this.isEdit ? 'Edit Task' : 'Add new Task';
  }

  get saveLabel(): string {
    return this.isEdit ? 'Edit' : 'Add';
  }

  save() {
    if (this.taskForm.invalid) {
      return;
    }

    if (this.isEdit) {
      this.dialogRef.close({ id: this.data!.id, ...this.taskForm.value });
      return;
    }

    this.dialogRef.close(this.taskForm.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
