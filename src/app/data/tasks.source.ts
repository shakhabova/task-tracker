import { Injectable } from '@angular/core';
import { Task, TaskAddModel } from '../models/task.model';
import { Observable, ReplaySubject, map, take, tap } from 'rxjs';
import { SortModel } from '../components/order-by/order-by.component';

const TASKS_STORAGE_KEY = 'TASKS_LOCAL_STORAGE_KEY';
const DEFAULT_SORT: SortModel = { value: 'deadlineDate', direction: 'asc' };

@Injectable({ providedIn: 'root' })
export class TasksSourceService {
  private readonly tasks$ = new ReplaySubject<Task[]>(1);

  constructor() {
    this.tasks$.next(this.readFromLocalStorage());
  }

  getAll(sort?: SortModel): Observable<Task[]> {
    return this.tasks$.asObservable()
      .pipe(
        map(tasks => {
          tasks = this.applySort(tasks, sort);
          return tasks;
        })
      );
  }

  get(taskId: Task['id']): Observable<Task | undefined> {
    return this.tasks$
      .asObservable()
      .pipe(map((tasks) => tasks.find((t) => t.id === taskId)));
  }

  add(addingTask: TaskAddModel): Observable<void> {
    const newTask: Task = {
      id: new Date().getTime(), // maybe use Window.crypto
      ...addingTask,
    };
    return this.tasks$.pipe(
      take(1),
      map((tasks) => {
        tasks.push(newTask);
        this.updateTasksList(tasks);
      })
    );
  }

  update(updatedTask: Task): Observable<void> {
    return this.tasks$.pipe(
      take(1),
      map((tasks) => {
        tasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        this.updateTasksList(tasks);
      })
    );
  }

  delete(deletingTaskId: Task['id']): Observable<void> {
    return this.tasks$.pipe(
      take(1),
      map((tasks) => {
        tasks = tasks.filter((task) => task.id !== deletingTaskId);
        this.updateTasksList(tasks);
      })
    );
  }

  private applySort(tasks: Task[], sort?: SortModel): Task[] {
    const currentSort = sort ?? DEFAULT_SORT;
    const tasksCopy = [...tasks];

    tasksCopy.sort((a, b) => {
      if (currentSort.direction === 'asc') {
        return a[currentSort.value].toString().localeCompare(b[currentSort.value].toString());
      } else {
        return b[currentSort.value].toString().localeCompare(a[currentSort.value].toString());
      }
    });

    return tasksCopy;
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
    } catch (e) {
      throw new Error('Error while parsing tasks from local storage');
    }
  }

  private writeToLocalStorage(tasks: Task[]): void {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }
}
