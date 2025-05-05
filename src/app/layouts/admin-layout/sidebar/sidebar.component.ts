import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/services';
import { User } from 'app/domain';

import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AutoComplete } from 'primeng/autocomplete';

interface Menu {
  id: number;
  link: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, InputIcon, AutoComplete, IconField, RouterLinkActive],
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
      link: '/admin/users',
      label: 'Usuarios',
      icon: 'pi pi-users',
    },
    {
      id: 3,
      link: '/admin/exercises',
      label: 'Ejercicios',
      icon: 'pi pi-bars',
    },
    {
      id: 4,
      link: '/admin/catalogs',
      label: 'Catálogos',
      icon: 'pi pi-bars',
    },
    {
      id: 10,
      link: '/admin/profile',
      label: 'Mi Perfil',
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
    });
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(['/signin']);
  }
}
