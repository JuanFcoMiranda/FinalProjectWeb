# 📊 Test & Coverage Report

## ✅ Tests: Passed

**Total:** 17 | **Passed:** ✅ 17 | **Failed:** ❌ 0 | **Skipped:** ⏭️ 0

### 📋 Test Details

| Suite | Test | Status | Time |
|-------|------|--------|------|
| TodoService | get() should throw when 404 | ✅ | 9ms |
| TodoService | list() should return a PaginatedList (default params) | ✅ | 4ms |
| TodoService | get() should return a single item when found | ✅ | 3ms |
| TodoService | delete() should call DELETE on the correct URL | ✅ | 1ms |
| TodoService | list() should allow custom page params | ✅ | 1ms |
| TodoService | update() should call PUT on the correct URL | ✅ | 2ms |
| TodoService | create() should throw if API returns null/undefined | ✅ | 2ms |
| ModalComponent | should not render when closed | ✅ | 20ms |
| ModalComponent | should render when open | ✅ | 6ms |
| ModalComponent | should emit close on backdrop click | ✅ | 3ms |
| TodosComponent | create() should call service.create and reset form | ✅ | 24ms |
| TodosComponent | should create | ✅ | 4ms |
| TodosComponent | remove() should call service.delete and reload | ✅ | 3ms |
| TodosComponent | should call list() on init | ✅ | 3ms |
| TodosComponent | goToEdit should navigate to edit page | ✅ | 3ms |
| AppComponent | should create the app | ✅ | 3ms |
| AppComponent | should render header | ✅ | 1ms |

## 🔴 Code Coverage: 56.73%

| Metric | Coverage | Covered | Total |
|--------|----------|---------|-------|
| **Statements** | 56.73% | 59 | 104 |
| **Lines** | 56.73% | 59 | 104 |
| **Functions** | 63.64% | 14 | 22 |
| **Branches** | 27.91% | 12 | 43 |
| **Complexity** | ~3.00 | - | 66 |

> 📊 **Estimated Cyclomatic Complexity:** 66 total, ~3.00 avg per function

### 🔍 Complexity by File

| File | Functions | Branches | Est. Complexity | Avg/Function |
|------|-----------|----------|-----------------|---------------|
| app.component.ts | 0 | 0 |  1 | N/A |
| modal.component.ts | 10 | 23 | 🟢 34 | 3.40 |
| todo.service.ts | 5 | 6 | 🟢 12 | 2.40 |
| todos.component.ts | 7 | 9 | 🟢 17 | 2.43 |
| environment.ts | 0 | 5 |  6 | N/A |

> 🟢 Low (≤5) | 🟡 Medium (6-10) | 🟠 High (11-20) | 🔴 Very High (>20)

### 📈 Coverage Progress

<table><tr><td>

⚠️ **56.73%** Lines Covered

```
█████████████████░░░░░░░░░░░░░
```

</td></tr></table>


