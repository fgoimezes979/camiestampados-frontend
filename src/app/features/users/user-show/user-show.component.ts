import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './user-show.component.html',
  styles: ``
})
export class UserShowComponent {
  user: User | null = null;
  
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🧪 ID capturado de la URL:', userId);

    if (!isNaN(userId)) {
      this.userService.getUserById(userId).subscribe({
        next: (response: { user: any }) => {
          console.log('🧪 Respuesta recibida del backend:', response);

          const p = response.user;
          if (!p) {
            console.error('⚠ usuario no encontrado en la respuesta');
            return;
          }

          // ✅ Corregido: asignar role y is_active correctamente
          this.user = {
            id: p.id,
            firstname: p.firstname,
            secondname: p.secondname,
            firstlastname: p.firstlastname,
            secondlastname: p.secondlastname,
            role: p.role === 'ADMIN' ? 'ADMIN' : 'USER', // obligatorio
            photo: p.photo || '', // opcional
            email: p.email,
            is_active: p.is_active === true || p.is_active === 'true'
          };

          this.cd.detectChanges();
        },
        error: (err: any) => console.error('❌ Error al obtener el usuario:', err)
      });
    } else {
      console.error('❌ ID inválido en la URL.');
    }
  }
}
