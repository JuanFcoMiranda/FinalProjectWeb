import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
}

export interface TodoItemBrief {
  id: number;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/TodoItems`;

  async list(): Promise<PaginatedList<TodoItemBrief>> {
    // Defaults to page 1, size 10
    const res = await firstValueFrom(this.http.get<PaginatedList<TodoItemBrief>>(this.base, {
      params: { pageNumber: 1, pageSize: 10 }
    }));

    // Ensure we never return undefined to satisfy strict typing
    return res ?? { items: [], pageNumber: 1, totalPages: 1, totalCount: 0 };
  }

  async create(title: string): Promise<number> {
    const res = await firstValueFrom(this.http.post<number | null>(this.base, { title }));
    if (res == null) {
      throw new Error('Create API did not return an id');
    }
    return res;
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }

  // Added: update a todo item's title
  async update(id: number, title: string): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${this.base}/${id}`, { title }));
  }

  // Get a single todo item by id
  async get(id: number): Promise<TodoItemBrief> {
    const res = await firstValueFrom(this.http.get<TodoItemBrief>(`${this.base}/${id}`));
    if (!res) throw new Error('Not found');
    return res;
  }
}
