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
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.http.post<any>('http://localhost:4040/api/security/users/login', { email, password }).subscribe({
      next: (res:any) => {

  console.log("RESPUESTA LOGIN:", res);

  const token = res.token;

  if(token){
    localStorage.setItem("token", token);
    console.log("TOKEN GUARDADO:", token);
    this.router.navigate(['/dashboard']);
  }else{
    alert("No se recibió token");
  }

},

        error: () => {
          alert('Correo o contraseña incorrectos');
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); // ✅ Marca los campos para mostrar errores
    }
  }
}
