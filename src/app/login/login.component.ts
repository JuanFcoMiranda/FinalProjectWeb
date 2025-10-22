import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  form: FormGroup = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)] })
  });
  error = signal('');

  async login() {
    this.error.set('');
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      const email = this.form.controls['email'].value || '';
      const password = this.form.controls['password'].value || '';
      await this.auth.login(email, password);
      await this.router.navigate(['/']);
    } catch (e: any) {
      this.error.set(e.message || 'Login failed');
    }
  }
}
