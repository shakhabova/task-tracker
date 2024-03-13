import {
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TaskItemComponent } from '../task-item/task-item.component';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TasksService } from 'src/app/services/tasks.service';
import { filter, switchMap } from 'rxjs';
import { Task, TaskAddModel } from 'src/app/models/task.model';
import { AsyncPipe } from '@angular/common';
import { OrderByComponent, SortModel } from '../order-by/order-by.component';
import { FilterComponent, FilterModel } from '../filter/filter.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    TaskItemComponent,
    MatDialogModule,
    OrderByComponent,
    FilterComponent,
  ],
})
export class TasksComponent {
  private dialog = inject(MatDialog);
  private tasksService = inject(TasksService);
  private destroyRef$ = inject(DestroyRef);

  tasks$ = this.tasksService.getAll();

  private filters?: FilterModel;
  private sort?: SortModel;

  openFiltersModal() {
    const dialogRef = this.dialog.open<FilterComponent, unknown, FilterModel>(FilterComponent);

    dialogRef.afterClosed()
      .pipe(
        filter(res => !!res),
        takeUntilDestroyed(this.destroyRef$),
      )
      .subscribe(filters => {
        this.filters = filters;
        this.updateTasksList();
      })
  }

  onOrderChange(sort: SortModel) {
    this.sort = sort;
    this.updateTasksList();
  }

  onAdd() {
    const dialogRef = this.dialog.open<
      TaskFormComponent,
      unknown,
      TaskAddModel
    >(TaskFormComponent);
    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap((task) => this.tasksService.add(task!)),
        takeUntilDestroyed(this.destroyRef$)
      )
      .subscribe();
  }

  onEdit(task: Task) {
    const dialogRef = this.dialog.open<TaskFormComponent, Task, Task>(
      TaskFormComponent,
      {
        data: task,
      }
    );

    dialogRef
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap((task) => this.tasksService.update(task!)),
        takeUntilDestroyed(this.destroyRef$)
      )
      .subscribe();
  }

  onDelete(task: Task) {
    this.tasksService
      .delete(task.id)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe();
  }

  private updateTasksList() {
    this.tasks$ = this.tasksService.getAll(this.filters, this.sort);
  }
}
