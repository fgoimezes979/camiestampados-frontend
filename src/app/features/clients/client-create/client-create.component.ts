import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  standalone: true,
  styleUrls: ['./client-create.component.scss'],
  imports: [ReactiveFormsModule,RouterModule],
})
export class ClientCreateComponent {
  clientForm: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient) {
    const defaultCode = this.generateDefaultCode(); 
    this.clientForm = this.fb.group({
      code: [this.generateDefaultCode(), [Validators.required, Validators.maxLength(5)]],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      birth:[''],
      sex:[''],
      direction:[''],
      phone:[''],
      email:['' ,[Validators.required, Validators.email]],
      
      is_active: [false]
    });
  }
  generateDefaultCode(): string {
    // Ejemplo: código aleatorio de 5 dígitos
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  onSubmit() {
    if (this.clientForm.valid) {
      console.log('Datos enviados:', this.clientForm.value); // ← revisa aquí
      this.http.post('https://inventarios-adso-api.onrender.com/api/parameters/clients', this.clientForm.value)
        .subscribe({
          next: res => {
            console.log('cliente creado:', res);
            alert('cliente creado con éxito');
          },
          error: err => {
            console.error('Error al crear cliente:', err);
            alert('Error al crear cliente');
          }
        });
    }
  }
}
