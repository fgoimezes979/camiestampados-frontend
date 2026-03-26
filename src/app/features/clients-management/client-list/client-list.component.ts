import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Declaramos jQuery para que TypeScript no marque error al cerrar el modal
declare var $: any;

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  searchTerm: string = '';
  
  // 1. Array principal (Datos iniciales)
  gestiones: any[] = [
    { 
      id: 1, 
      cliente: { name: 'Empresa Textil S.A.' }, 
      descripcion: 'Dotación 50 camisetas polo', 
      estado: 'En curso', 
      monto: 1500000, 
      fecha_contacto: '2026-03-20' 
    },
    { 
      id: 2, 
      cliente: { name: 'Juan Pérez' }, 
      descripcion: 'Lechona 80 porciones - Evento Familiar', 
      estado: 'Cerrado', 
      monto: 640000, 
      fecha_contacto: '2026-03-21' 
    }
  ];

  gestionesFiltradas: any[] = [];

  // 2. Objeto para el formulario (Solo una vez)
  nuevaGestion: any = {
    cliente_nombre: '',
    descripcion: '',
    monto: 0,
    estado: 'En curso'
  };

  ngOnInit() {
    this.filtrarGestiones(); // Inicializa la lista filtrada
  }

  // 3. Función de búsqueda
  filtrarGestiones() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.gestionesFiltradas = [...this.gestiones];
    } else {
      this.gestionesFiltradas = this.gestiones.filter(g => 
        g.cliente?.name.toLowerCase().includes(term) || 
        g.descripcion.toLowerCase().includes(term)
      );
    }
  }

  // 4. Lógica para guardar (CRUD)
  guardarNuevaGestion() {
    // Creamos el objeto con el formato que espera la tabla
    const nueva = { 
      id: Date.now(), 
      cliente: { name: this.nuevaGestion.cliente_nombre },
      descripcion: this.nuevaGestion.descripcion,
      monto: this.nuevaGestion.monto,
      estado: this.nuevaGestion.estado,
      fecha_contacto: new Date().toISOString().split('T')[0] 
    };
    
    // Insertamos en el array principal
    this.gestiones.push(nueva);
    
    // Refrescamos la vista
    this.filtrarGestiones(); 
    
    // Limpiamos el formulario para la próxima vez
    this.nuevaGestion = { cliente_nombre: '', descripcion: '', monto: 0, estado: 'En curso' };
    
    // Cerramos el modal usando jQuery (Si usas Bootstrap 4)
    if (typeof $ !== 'undefined') {
      $('#modalCrearGestion').modal('hide');
    }
  }

  // 5. Otros Métodos de Acción
  abrirNuevaGestion() {
    // Si el botón solo abre el modal por data-target en el HTML, 
    // puedes usar esto para resetear el formulario.
    this.nuevaGestion = { cliente_nombre: '', descripcion: '', monto: 0, estado: 'En curso' };
    if (typeof $ !== 'undefined') {
      $('#modalCrearGestion').modal('show');
    }
  }

  verDetalle(gestion: any) {
    console.log('Detalle:', gestion);
  }

  editarGestion(gestion: any) {
    console.log('Editando:', gestion);
  }

  eliminarGestion(id: any) {
    if(confirm('¿Está seguro de eliminar esta gestión?')) {
      this.gestiones = this.gestiones.filter(g => g.id !== id);
      this.filtrarGestiones();
    }
  }
}