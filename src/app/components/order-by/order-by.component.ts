import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Task } from 'src/app/models/task.model';

export interface SortModel {
  value: keyof Pick<Task, 'deadlineDate' | 'status' | 'assignee'>;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-order-by',
  standalone: true,
  imports: [MatButtonToggleModule],
  templateUrl: './order-by.component.html',
  styleUrl: './order-by.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderByComponent {
  @Output() change = new EventEmitter<SortModel>();

  currentValue: SortModel['value'] = 'deadlineDate';
  currentDirection: SortModel['direction'] = 'asc';

  onChange() {
    if (!this.currentValue || !this.currentDirection) {
      return;
    }

    this.change.emit({
      value: this.currentValue,
      direction: this.currentDirection,
    });
  }
}
