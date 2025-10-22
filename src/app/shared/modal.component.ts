import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();

  private previouslyFocused?: Element | null;
  private onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.open) {
      // Opened: save focus and attach listeners
      this.previouslyFocused = (document && (document.activeElement)) || null;
      document.addEventListener('keydown', this.onKeyDown);
      // focus first focusable after a tick
      setTimeout(() => this.focusFirst(), 10);
    } else {
      // Closed: restore focus and remove listeners
      document.removeEventListener('keydown', this.onKeyDown);
      if (this.previouslyFocused && (this.previouslyFocused as HTMLElement).focus) {
        (this.previouslyFocused as HTMLElement).focus();
      }
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.emitClosed();
      return;
    }

    if (e.key === 'Tab') {
      this.trapTabKey(e);
    }
  }

  private trapTabKey(e: KeyboardEvent) {
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0] as HTMLElement;
    const last = focusable.at(-1) as HTMLElement;
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (!active || active === first) {
        last?.focus();
        e.preventDefault();
        return;
      }
      return;
    }
    // forward tab
    if (!active || active === last) {
      first?.focus();
      e.preventDefault();
    }
  }

  private getFocusableElements(): Element[] {
    const container = this.el.nativeElement.querySelector('.app-modal');
    if (!container) return [];
    const selectors = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'];
    return Array.from(container.querySelectorAll(selectors.join(',')));
  }

  private focusFirst() {
    const focusable = this.getFocusableElements();
    if (focusable.length) {
      (focusable[0] as HTMLElement).focus();
    } else {
      // focus modal container
      const container = this.el.nativeElement.querySelector('.app-modal') as HTMLElement | null;
      if (container) container.focus();
    }
  }

  emitClosed() {
    this.closed.emit();
  }
}
