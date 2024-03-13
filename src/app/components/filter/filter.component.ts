import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { STATUS_OPTIONS } from '../task-form/task-form.component';
import { AsyncPipe } from '@angular/common';
import { TasksService } from 'src/app/services/tasks.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/models/task.model';

type FilterKeys = keyof Pick<Task, 'status' | 'assignee' | 'deadlineDate'>;
export type FilterModel = {
  [K in FilterKeys]: string[]
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    AsyncPipe,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  private tasksService = inject(TasksService);
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FilterComponent, FilterModel>)

  formGroup = this.formBuilder.group({
    status: [''],
    assignee: [''],
    deadlineStart: [''],
    deadlineEnd: [''],
  });
  
  statusOptions = STATUS_OPTIONS;
  assigneeOptions$ = this.tasksService.getAllAssignees();

  apply() {
    const value = this.formGroup.value;
    this.dialogRef.close({
      status: value.status,
      assignee: value.assignee,
      deadlineDate: [value.deadlineStart, value.deadlineEnd],
    });
  }
}
