import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TaskItemComponent } from "../task-item/task-item.component";

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    standalone: true,
    imports: [MatButtonModule, TaskItemComponent]
})
export class TasksComponent {

}
