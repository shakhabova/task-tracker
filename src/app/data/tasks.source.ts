import { Injectable } from '@angular/core';
import { Task, TaskAddModel } from '../models/task.model';
import { Observable, ReplaySubject, map, take, tap } from 'rxjs';

const TASKS_STORAGE_KEY = 'TASKS_LOCAL_STORAGE_KEY';

@Injectable({providedIn: 'root'})
export class TasksSourceService {
    private readonly tasks$ = new ReplaySubject<Task[]>(1);

    constructor() {
        this.tasks$.next(this.readFromLocalStorage());
    }

    getAll(): Observable<Task[]> {
        return this.tasks$.asObservable();
    }

    get(taskId: Task['id']): Observable<Task | undefined> {
        return this.tasks$.asObservable()
            .pipe(
                map(tasks => tasks.find(t => t.id === taskId))
            );
    }

    add(addingTask: TaskAddModel): Observable<void> {
        const newTask: Task = {
            id: new Date().getTime(), // maybe use Window.crypto
            ...addingTask
        };
        return this.tasks$
            .pipe(
                take(1),
                map(tasks => {
                    tasks.push(newTask);
                    this.updateTasksList(tasks);
                }),
            );
    }

    update(updatedTask: Task): Observable<void> {
        return this.tasks$
            .pipe(
                take(1),
                map(tasks => {
                    tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
                    this.updateTasksList(tasks);
                }),
            );
    }

    delete(deletingTaskId: Task['id']): Observable<void> {
        return this.tasks$
            .pipe(
                take(1),
                map(tasks => {
                    tasks = tasks.filter(task => task.id !== deletingTaskId);
                    this.updateTasksList(tasks);
                }),
            );
    }

    private updateTasksList(newTasks: Task[]): void {
        this.writeToLocalStorage(newTasks);
        this.tasks$.next(newTasks);
    }
    
    private readFromLocalStorage(): Task[] {
        const data = localStorage.getItem(TASKS_STORAGE_KEY);
        if (!data) {
            return [];
        }

        try {
            return JSON.parse(data);
        } catch(e) {
            throw new Error('Error while parsing tasks from local storage');
        }
    }

    private writeToLocalStorage(tasks: Task[]): void {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }
}