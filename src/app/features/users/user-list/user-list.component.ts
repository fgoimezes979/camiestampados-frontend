import { Component } from '@angular/core';
import {RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './user-list.component.html',
  styles: ``
})
export class UserListComponent {

  users: User[] = [];
  editingId: number | null = null;
  photo: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: User[] | { users: User[] }) => {
        this.users = Array.isArray(response) ? response : response.users;
      },
      error: (err) => {
        console.error('❌ Error al cargar usuario:', err);
      }
    });
  }

  startEdit(id: number) {
    this.editingId = id;
  }

  saveEdit(user: User) {
    this.editingId = null;
  }

  cancelEdit() {
    this.editingId = null;
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (error) => {
          console.error('❌ Error al eliminar el usuario:', error);
        }
      });
    }
  }
}
