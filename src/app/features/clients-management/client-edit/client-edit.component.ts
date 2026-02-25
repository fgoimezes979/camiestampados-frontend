import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ClientEditComponent implements OnInit {
  clientForm!: FormGroup;
  clientId!: number;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadClientData();
  }

  initForm() {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
  }

  loadClientData() {
    if (!this.clientId) return;
    this.isLoading = true;
    this.clientService.getClientById(this.clientId).subscribe({
      next: (client) => {
        this.clientForm.patchValue(client);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando cliente:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) return;

    this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
      next: () => {
        alert('Cliente actualizado correctamente');
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Error actualizando cliente:', err);
      }
    });
  }
}
