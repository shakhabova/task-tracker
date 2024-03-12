import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TaskAddModel } from '../models/task.model';
import { TasksSourceService } from '../data/tasks.source';
import { SortModel } from '../components/order-by/order-by.component';

@Injectable({providedIn: 'root'})
export class TasksService {
    constructor(private tasksSource: TasksSourceService) { }
    
    getAll(sort?: SortModel): Observable<Task[]> {
        return this.tasksSource.getAll(sort);
    }

    get(taskId: Task['id']): Observable<Task | undefined> {
        return this.tasksSource.get(taskId);
    }

    add(task: TaskAddModel): Observable<void> {
        console.log('hoho')
        return this.tasksSource.add(task);
    }

    update(task: Task): Observable<void> {
        return this.tasksSource.update(task);
    }

    delete(taskId: Task['id']): Observable<void> {
        return this.tasksSource.delete(taskId);
    }
}