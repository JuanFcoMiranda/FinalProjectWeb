import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService, TodoItemBrief } from './todo.service';
import { ModalComponent } from '../shared/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  private readonly api = inject(TodoService);
  private readonly router = inject(Router);

  items = signal<TodoItemBrief[]>([]);
  // Strongly-typed FormGroup: title is a FormControl of strings
  form: FormGroup<{ title: FormControl<string | null> }> = new FormGroup({
    title: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(1)] })
  });
  error = signal('');

  // UX flags
  loading = signal(false);
  savingId = signal<number | null>(null);
  message = signal('');

   ngOnInit(): void {
     this.load();
   }

  async load() {
    this.loading.set(true);
    try {
      const list = await this.api.list();
      this.items.set(list.items);
    } catch (e: any) {
      this.error.set(e.message || 'Failed to load');
    } finally {
      this.loading.set(false);
    }
  }

  async create() {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('El título no puede estar vacío');
      return;
    }
    const title = (this.form.controls['title'].value || '').toString().trim();
    try {
      this.savingId.set(-1); // special value for create
      await this.api.create(title);
      this.form.controls['title'].setValue('');
      this.message.set('Created');
      await this.load();
    } catch (e: any) {
      this.error.set(e.message || 'Failed to create');
    } finally {
      this.savingId.set(null);
    }
  }

  async remove(id: number) {
    this.error.set('');
    try {
      this.savingId.set(id);
      await this.api.delete(id);
      this.message.set('Deleted');
      await this.load();
    } catch (e: any) {
      this.error.set(e.message || 'Failed to delete');
    } finally {
      this.savingId.set(null);
    }
  }

  // editing moved to separate route/page
  goToEdit(id: number) {
    this.router.navigate(['/todos', id, 'edit']);
  }

  // template-facing wrapper
  onEdit(id: number) {
    this.goToEdit(id);
  }


  // Clear the error modal
  clearError() {
    this.error.set('');
  }

}
