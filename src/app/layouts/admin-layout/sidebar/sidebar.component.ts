import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/services';
import { User } from 'app/domain';

interface Menu {
  id: number;
  link: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

  menus: Menu[] = [
    {
      id: 1,
      link: '/admin/',
      label: 'Dasboard',
      icon: 'pi pi-home',
    },
    {
      id: 2,
      link: '/admin/posts',
      label: 'Publicaciones',
      icon: 'pi pi-image',
    },
    {
      id: 3,
      link: '/admin/comments',
      label: 'Comentarios',
      icon: 'pi pi-comment',
    },
    {
      id: 4,
      link: '/admin/workouts',
      label: 'Rutinas',
      icon: 'pi pi-bars',
    },
    {
      id: 5,
      link: '/admin/exercises',
      label: 'Ejercicios',
      icon: 'pi pi-bars',
    },
    {
      id: 6,
      link: '/admin/measures',
      label: 'Medidas',
      icon: 'pi pi-bars',
    },
    {
      id: 7,
      link: '/admin/catalogs',
      label: 'Catálogos',
      icon: 'pi pi-bars',
    },
    {
      id: 8,
      link: '/admin/users',
      label: 'Usuarios',
      icon: 'pi pi-user',
    },
  ];

  user!: User;

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this._userService.user$.subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: (err) => {
        console.log('error getting profile');
      },
    });
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/signin']);
  }
}
