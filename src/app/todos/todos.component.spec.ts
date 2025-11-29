import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';
import { vi } from 'vitest';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let mockService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockService = {
      list: vi.fn().mockResolvedValue({ items: [], pageNumber: 1, totalPages: 1, totalCount: 0 }),
      create: vi.fn().mockResolvedValue(1),
      delete: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined)
    };

    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [
        { provide: TodoService, useValue: mockService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call list() on init', async () => {
    expect(mockService.list).toHaveBeenCalled();
  });

  it('create() should call service.create and reset form', async () => {
    component.form.controls.title.setValue('New todo');
    await component.create();
    expect(mockService.create).toHaveBeenCalledWith('New todo');
    expect(component.form.controls.title.value).toBe('');
  });

  it('remove() should call service.delete and reload', async () => {
    mockService.list.mockClear();
    await component.remove(5);
    expect(mockService.delete).toHaveBeenCalledWith(5);
    expect(mockService.list).toHaveBeenCalled();
  });

  it('goToEdit should navigate to edit page', () => {
    component.goToEdit(7);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/todos', 7, 'edit']);
  });
});
