import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-create.component.html',
  styles: ``
})
export class UserCreateComponent {
  userForm: FormGroup;

  // 🔹 Imágenes disponibles
  images: string[] = [
    'avatar4.png',
    'avatar5.png',
    'foto_u2.jpg',
    'foto_u1.jpg',
  ];

  // 🔹 Roles disponibles
  roles: string[] = ['USER', 'ADMIN'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      secondname: [''],
      firstlastname: ['', Validators.required],
      secondlastname: ['', Validators.required],
      photo: [''],        // opcional
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      is_active: [true, Validators.required],
      user_creates_id: [1, Validators.required],  // ejemplo
      role: ['USER', Validators.required]         // 🔹 valor por defecto
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          console.log('✅ Usuario creado');
          this.router.navigate(['/user-list']); 
        },
        error: (err: any) => {
          console.error('❌ Error al crear usuario', err);
        }
      });
    } else {
      this.userForm.markAllAsTouched(); // marca errores si hay campos vacíos
    }
  }
}
