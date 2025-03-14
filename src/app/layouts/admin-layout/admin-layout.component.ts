import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/services';
import { User } from 'app/domain';

interface Menu {
  id: number;
  link: string;
  label: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

  user!: User;

  menus: Menu[] = [
    {
      id: 1,
      link: '/admin/',
      label: 'Dasboard',
    },
    {
      id: 2,
      link: '/admin/posts',
      label: 'Publicaciones',
    },
    {
      id: 3,
      link: '/admin/comments',
      label: 'Comentarios',
    },
    {
      id: 4,
      link: '/admin/routines',
      label: 'Rutinas',
    },
    {
      id: 5,
      link: '/admin/exercises',
      label: 'Ejercicios',
    },
    {
      id: 6,
      link: '/admin/measures',
      label: 'Medidas',
    },
    {
      id: 7,
      link: '/admin/catalogs',
      label: 'Catálogos',
    },
  ];

  constructor() {}

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
