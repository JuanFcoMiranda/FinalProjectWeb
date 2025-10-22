import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService, TodoItemBrief } from './todo.service';
import { TodoEditComponent } from './todo-edit.component';

@Component({
  selector: 'app-todo-edit-page',
  standalone: true,
  imports: [CommonModule, TodoEditComponent],
  templateUrl: './todo-edit-page.component.html',
  styleUrls: ['./todo-edit-page.component.css']
})
export class TodoEditPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(TodoService);

  item = signal<TodoItemBrief | null>(null);
  loading = signal(false);
  error = signal('');
  saving = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid id');
      return;
    }
    // Load from list (since GET individual endpoint doesn't exist)
    this.loadFromList(id);
  }

  async loadFromList(id: number) {
    this.loading.set(true);
    try {
      const list = await this.api.list();
      const found = list.items.find(item => item.id === id);
      if (found) {
        this.item.set(found);
      } else {
        this.error.set('Item not found');
      }
    } catch (e: any) {
      this.error.set(e.message || 'Failed to load item');
    } finally {
      this.loading.set(false);
    }
  }

  async save(title: string) {
    if (!this.item()) return;
    this.saving.set(true);
    this.error.set('');
    try {
      await this.api.update(this.item()!.id, title);
      await this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(e.message || 'Failed to save');
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
