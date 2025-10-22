import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let mockService: jasmine.SpyObj<TodoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {mockService = jasmine.createSpyObj('TodoService', ['list', 'create', 'delete', 'update']);
    mockService.list.and.returnValue(Promise.resolve({ items: [], pageNumber: 1, totalPages: 1, totalCount: 0 }));
    mockService.create.and.returnValue(Promise.resolve(1));
    mockService.delete.and.returnValue(Promise.resolve());
    mockService.update.and.returnValue(Promise.resolve());

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

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
    component.form.controls['title'].setValue('New todo');
    await component.create();
    expect(mockService.create).toHaveBeenCalledWith('New todo');
    expect(component.form.controls['title'].value).toBe('');
  });

  it('remove() should call service.delete and reload', async () => {
    mockService.list.calls.reset();
    await component.remove(5);
    expect(mockService.delete).toHaveBeenCalledWith(5);
    expect(mockService.list).toHaveBeenCalled();
  });

  it('goToEdit should navigate to edit page', () => {
    component.goToEdit(7);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/todos', 7, 'edit']);
  });
});
