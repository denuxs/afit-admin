import { Component, inject, OnInit } from '@angular/core';
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
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);

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
      link: '/admin/workouts',
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

  user!: User;

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this._userService.user$.subscribe({
      next: (response: User) => {
        this.user = response;
      },
    });
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/signin']);
  }
}
