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

  // Helper to reduce duplication: find request by url and assert method, params and body if provided
  function expectRequest({ url, method, params, body }: { url: string | RegExp, method?: string, params?: Record<string, string>, body?: any }) {
    const req = httpMock.expectOne((r) => typeof url === 'string' ? r.url === url : url.test(r.url));
    if (method) expect(req.request.method).toBe(method);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        expect(req.request.params.get(k)).toBe(String(v));
      }
    }
    if (body !== undefined) expect(req.request.body).toEqual(body);
    return req;
  }

  it('list() should return a PaginatedList (default params)', async () => {
    const mockResp: PaginatedList<TodoItemBrief> = { items: [{ id: 1, title: 'a' }], pageNumber: 1, totalPages: 1, totalCount: 1 };

    const promise = service.list();

    const req = expectRequest({ url: base, method: 'GET', params: { pageNumber: '1', pageSize: '10' } });
    req.flush(mockResp);

    const res = await promise;
    expect(res).toEqual(mockResp);
  });

  it('list() should allow custom page params', async () => {
    const mockResp: PaginatedList<TodoItemBrief> = { items: [{ id: 2, title: 'b' }], pageNumber: 2, totalPages: 3, totalCount: 30 };

    const promise = service.list(2, 20);

    const req = expectRequest({ url: base, method: 'GET', params: { pageNumber: '2', pageSize: '20' } });
    req.flush(mockResp);

    const res = await promise;
    expect(res).toEqual(mockResp);
  });

  it('create() should throw if API returns null/undefined', async () => {
    const createPromise = service.create('new title');

    const req = expectRequest({ url: base, method: 'POST', body: { title: 'new title' } });
    req.flush(null);

    await expectAsync(createPromise).toBeRejectedWithError('Create API did not return an id');
  });

  it('delete() should call DELETE on the correct URL', async () => {
    const p = service.delete(42);
    const req = expectRequest({ url: `${base}/42`, method: 'DELETE' });
    req.flush(null);
    await p;
  });

  it('update() should call PUT on the correct URL', async () => {
    const p = service.update(7, 'updated');
    const req = expectRequest({ url: `${base}/7`, method: 'PUT', body: { title: 'updated' } });
    req.flush(null);
    await p;
  });

  it('get() should return a single item when found', async () => {
    const mock: TodoItemBrief = { id: 5, title: 'five' };
    const p = service.get(5);
    const req = expectRequest({ url: `${base}/5`, method: 'GET' });
    req.flush(mock);
    const res = await p;
    expect(res).toEqual(mock);
  });

  it('get() should throw when 404', async () => {
    const p = service.get(999);
    const req = expectRequest({ url: `${base}/999`, method: 'GET' });
    req.flush(null, { status: 404, statusText: 'Not Found' });
    await expectAsync(p).toBeRejected();
  });
});
