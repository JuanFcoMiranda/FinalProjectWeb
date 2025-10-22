import { Routes } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { TodoEditPageComponent } from './todos/todo-edit-page.component';

export const routes: Routes = [
  { path: '', component: TodosComponent },
  { path: 'todos/:id/edit', component: TodoEditPageComponent },
  { path: '**', redirectTo: '' }
];
