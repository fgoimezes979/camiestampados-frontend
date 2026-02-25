import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, NgIfContext } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { Client} from '../../../models/client.model';
@Component({
  selector: 'app-client-show',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './client-show.component.html',

  styles: ''
})
export class ClientShowComponent implements OnInit {
  client: Client | null = null;


  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🧪 ID capturado de la URL:', clientId);

    if (!isNaN(clientId)) {
      this.clientService.getClientById(clientId).subscribe({
        next: (response)=> {
          console.log('🧪 Respuesta recibida del backend:', response);

          const p = response.client;
          console.log('📦 cliente recibido:', p);
          if (!p) {
            console.error('⚠ cliente no encontrado en la respuesta');
            return;
          }

          this.client = {
  id: p.id,
  code: p.code,
  name: p.name,
  last_name: p.last_name,
  birth: p.birth,
  sex: p.sex,
  direction: p.direction,
  phone: p.phone,
  email: p.email,
  isActive: p.is_active
};


          this.cd.detectChanges();
        },
        error: (err) => console.error('❌ Error al obtener el cliente:', err)
      });
    } else {
      console.error('❌ ID inválido en la URL.');
    }
  }
}
