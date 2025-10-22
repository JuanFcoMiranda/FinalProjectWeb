import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService, PaginatedList, TodoItemBrief } from './todo.service';
import { environment } from '../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}/TodoItems`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('list() should return a PaginatedList', async () => {
    const mockResp: PaginatedList<TodoItemBrief> = { items: [{ id: 1, title: 'a' }], pageNumber: 1, totalPages: 1, totalCount: 1 };

    const promise = service.list();

    const req = httpMock.expectOne(`${base}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResp);

    const res = await promise;
    expect(res).toEqual(mockResp);
  });

  it('create() should throw if API returns null/undefined', async () => {
    const createPromise = service.create('new title');

    const req = httpMock.expectOne(`${base}`);
    expect(req.request.method).toBe('POST');
    req.flush(null);

    await expectAsync(createPromise).toBeRejectedWithError('Create API did not return an id');
  });

  it('delete() should call DELETE on the correct URL', async () => {
    const p = service.delete(42);
    const req = httpMock.expectOne(`${base}/42`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await p;
  });

  it('update() should call PUT on the correct URL', async () => {
    const p = service.update(7, 'updated');
    const req = httpMock.expectOne(`${base}/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ title: 'updated' });
    req.flush(null);
    await p;
  });
});
