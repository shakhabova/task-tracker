export interface Task {
    id: number;
    caption: string;
    description: string;
    deadlineDate: string;
    priority: TaskPriority;
    assignee: string;
    status: TaskStatus;
}

export type TaskAddModel = Omit<Task, 'id'>;

export enum TaskStatus {
    ToDo = 'to_do',
    InProgress = 'in_progress',
    Done = 'done'
}

export enum TaskPriority {
    Lowest = 0,
    Low = 1,
    Medium = 2,
    High = 3,
    Highest = 4
}