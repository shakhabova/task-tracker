import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TaskItemComponent } from '../task-item/task-item.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: true,
  imports: [MatButtonModule, TaskItemComponent, MatDialogModule],
})
export class TasksComponent {
  constructor(public dialog: MatDialog) {}

  add() {
    const dialogRef = this.dialog.open(TaskFormComponent);
    dialogRef.afterClosed().subscribe((task) => {
      if (!task) {
        return;
      }

      console.log(task);
    });
  }
}
