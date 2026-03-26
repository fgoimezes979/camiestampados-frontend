import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 1. Importante para el [(ngModel)]

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // 2. Agrégalo aquí
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.css'
})
export class ClientCreateComponent {
editarEstado(arg0: any) {
throw new Error('Method not implemented.');
}
verDetalle(arg0: any) {
throw new Error('Method not implemented.');
}
  
  // Objeto que se llena desde el formulario HTML
  nuevaGestion: any = {
    cliente_nombre: '',
    servicio: '',
    estado: 'En curso',
    monto: 0,
    fecha_contacto: new Date().toISOString().split('T')[0]
  };
gestiones: any;

  constructor(private router: Router) {} // Para redirigir tras guardar

  guardar() {
    // Aquí es donde conectas con tu API
    console.log('Datos a guardar:', this.nuevaGestion);
    
    // Ejemplo de lógica:
    // this.gestionService.create(this.nuevaGestion).subscribe({
    //   next: (res) => {
    //     alert('Gestión guardada con éxito');
    //     this.router.navigate(['/gestiones']); // Vuelve a la tabla
    //   },
    //   error: (err) => console.error('Error al guardar', err)
    // });

    alert('Simulación: Gestión de ' + this.nuevaGestion.cliente_nombre + ' guardada.');
    this.router.navigate(['/dashboard/gestiones']); // Ajusta según tu ruta
  }
}