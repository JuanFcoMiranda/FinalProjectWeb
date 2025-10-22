import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ModalComponent] }).compileComponents();
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render when closed', () => {
    component.open = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.modal-backdrop'))).toBeNull();
  });

  it('should render when open', () => {
    component.open = true;
    component.title = 'Test';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.modal-backdrop'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.app-modal h3')).nativeElement.textContent).toContain('Test');
  });

  it('should emit close on backdrop click', () => {
    component.open = true;
    fixture.detectChanges();
    spyOn(component.close, 'emit');
    const backdrop = fixture.debugElement.query(By.css('.modal-backdrop'));
    backdrop.triggerEventHandler('click', { target: backdrop.nativeElement });
    expect(component.close.emit).toHaveBeenCalled();
  });
});

