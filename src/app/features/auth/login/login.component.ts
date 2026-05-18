import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post<any>('https://inventarios-adso-api.onrender.com/api/security/users/login', { email, password })
      .subscribe({

        next: (res: any) => {

          console.log("RESPUESTA LOGIN:", res);

          if (res.token) {

            // guardar token
            localStorage.setItem("token", res.token);

            // guardar usuario
            if (res.user) {
              localStorage.setItem("user", JSON.stringify(res.user));
              console.log("USUARIO GUARDADO:", res.user);
            }

            this.router.navigate(['/dashboard']);

          } else {
            alert("No se recibió token");
          }

        },

        error: () => {
          alert('Correo o contraseña incorrectos');
        }

      });

  }

}
