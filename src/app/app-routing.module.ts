import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { TmplAstBoundAttribute } from '@angular/compiler';

const routes: Routes = [
{path: 'tasks', component: TasksComponent, title: 'Tasks'},
{ path: '',   redirectTo: '/tasks', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
