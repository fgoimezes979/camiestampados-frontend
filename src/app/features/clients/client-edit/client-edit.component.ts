import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  templateUrl: './client-edit.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ClientEditComponent implements OnInit {

  clientForm!: FormGroup;
  id: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      last_name: [''],
      birth: [''],
      sex: [''],
      email: [''],
      direction: [''],
      phone: [''],
      is_active: [false],
      user_creates_id: [{ value: null, disabled: true }],
      user_updates_id: [null],
      created_at: [{ value: '', disabled: true }],
      updated_at: [{ value: '', disabled: true }],
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.id)) {
      console.error('❌ ID inválido en la URL');
      return;
    }

    this.clientService.getClientById(this.id).subscribe({
      next: (response) => {
        console.log('✅ Cliente recibido del backend:', response.client);
        this.clientForm.patchValue(response.client);
      },
      error: (err: any) => {
        console.error('❌ Error al cargar cliente:', err);
      }
    });
  }

  onsubmit(): void {
    if (this.clientForm.valid) {
      const updatedClient = this.clientForm.getRawValue(); // Incluye campos deshabilitados
      this.clientService.updateClient(this.id, updatedClient).subscribe({
        next: () => {
          alert('✅ Cliente actualizado con éxito');
          this.router.navigate(['/clients']);
        },
        error: (err: any) => {
          console.error('❌ Error al actualizar el cliente:', err);
        }
      });
    } else {
      alert('❌ Formulario inválido. Por favor, revisa los campos requeridos.');
    }
  }
}
