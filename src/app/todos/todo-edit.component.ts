import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.css']
})
export class TodoEditComponent implements OnChanges {
  @Input() title: string | null = '';
  @Input() saving = false;
  @Output() save = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  control = new FormControl<string | null>(null, { validators: [Validators.required, Validators.minLength(1)] });

  ngOnChanges(_changes: SimpleChanges): void {
    this.control.setValue(this.title ?? '');
  }

  onSave() {
    if (this.control.invalid) {
      this.control.markAsTouched();
      return;
    }
    const value = (this.control.value || '').toString().trim();
    this.save.emit(value);
  }

  onCancel() {
    this.cancelled.emit();
  }
}
