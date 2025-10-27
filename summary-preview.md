# 📊 Test & Coverage Report

## ✅ Tests: Passed

**Total:** 17 | **Passed:** ✅ 17 | **Failed:** ❌ 0 | **Skipped:** ⏭️ 0

### 📋 Test Details

| Suite | Test | Status | Time |
|-------|------|--------|------|
| AppComponent | should render header | ✅ | 20ms |
| AppComponent | should create the app | ✅ | 3ms |
| TodosComponent | goToEdit should navigate to edit page | ✅ | 36ms |
| TodosComponent | should call list() on init | ✅ | 4ms |
| TodosComponent | should create | ✅ | 3ms |
| TodosComponent | create() should call service.create and reset form | ✅ | 3ms |
| TodosComponent | remove() should call service.delete and reload | ✅ | 3ms |
| TodoService | list() should return a PaginatedList (default params) | ✅ | 3ms |
| TodoService | get() should throw when 404 | ✅ | 2ms |
| TodoService | update() should call PUT on the correct URL | ✅ | 1ms |
| TodoService | get() should return a single item when found | ✅ | 1ms |
| TodoService | create() should throw if API returns null/undefined | ✅ | 2ms |
| TodoService | list() should allow custom page params | ✅ | 1ms |
| TodoService | delete() should call DELETE on the correct URL | ✅ | 1ms |
| ModalComponent | should render when open | ✅ | 3ms |
| ModalComponent | should not render when closed | ✅ | 1ms |
| ModalComponent | should emit close on backdrop click | ✅ | 1ms |

## 🔴 Code Coverage: 56.73%

| Metric | Coverage | Covered | Total |
|--------|----------|---------|-------|
| **Lines** | 56.73% | 59 | 104 |
| **Functions** | 63.64% | 14 | 22 |
| **Branches** | 27.91% | 12 | 43 |

### 📈 Coverage Progress

<table><tr><td>

⚠️ **56.73%** Lines Covered

```
█████████████████░░░░░░░░░░░░░
```

</td></tr></table>


