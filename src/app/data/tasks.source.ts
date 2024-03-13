import { Injectable } from '@angular/core';
import { Task, TaskAddModel } from '../models/task.model';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { SortModel } from '../components/order-by/order-by.component';
import { FilterModel } from '../components/filter/filter.component';

const TASKS_STORAGE_KEY = 'TASKS_LOCAL_STORAGE_KEY';
const DEFAULT_SORT: SortModel = { value: 'deadlineDate', direction: 'asc' };

@Injectable({ providedIn: 'root' })
export class TasksSourceService {
  private readonly tasks$ = new BehaviorSubject<Task[]>(
    this.readFromLocalStorage()
  );

  private get currentTasks(): Task[] {
    return this.tasks$.value;
  }

  getAll(filters?: FilterModel, sort?: SortModel): Observable<Task[]> {
    return this.tasks$.asObservable().pipe(
      map((tasks) => {
        tasks = this.applySort(tasks, sort);
        tasks = this.applyFilters(tasks, filters);
        return tasks;
      })
    );
  }

  getAllAssignee(): Observable<string[]> {
    return this.tasks$
      .asObservable()
      .pipe(
        map((tasks) => Array.from(new Set(tasks.map((task) => task.assignee))))
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
    this.updateTasksList([...this.currentTasks, newTask]);
    return of();
  }

  update(updatedTask: Task): Observable<void> {
    const newTasks = this.currentTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.updateTasksList(newTasks);
    return of();
  }

  delete(deletingTaskId: Task['id']): Observable<void> {
    const newTasks = this.currentTasks.filter(
      (task) => task.id !== deletingTaskId
    );
    this.updateTasksList(newTasks);
    return of();
  }

  private applySort(tasks: Task[], sort?: SortModel): Task[] {
    const currentSort = sort ?? DEFAULT_SORT;
    const tasksCopy = [...tasks];

    tasksCopy.sort((a, b) => {
      if (currentSort.direction === 'asc') {
        return a[currentSort.value]
          .toString()
          .localeCompare(b[currentSort.value].toString());
      } else {
        return b[currentSort.value]
          .toString()
          .localeCompare(a[currentSort.value].toString());
      }
    });

    return tasksCopy;
  }

  private applyFilters(tasks: Task[], filters?: FilterModel): Task[] {
    if (!filters) {
      return tasks;
    }

    return tasks.filter((task) => {
      if (filters.status?.length && !filters.status.includes(task.status)) {
        return false;
      }

      if (
        filters.assignee?.length &&
        !filters.assignee.includes(task.assignee)
      ) {
        return false;
      }

      if (filters.deadlineDate?.length === 2) {
        const isInRange =
          task.deadlineDate >= filters.deadlineDate[0] &&
          task.deadlineDate <= filters.deadlineDate[1];

        if (!isInRange) {
          return false;
        }
      }

      return true;
    });
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
