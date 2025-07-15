import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/services';
import { User } from 'app/interfaces';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidDumbbell,
  faSolidUser,
  faSolidUserGroup,
  faSolidWrench,
  faSolidHouse,
  faSolidBars,
  faSolidBell,
  faSolidFolder,
} from '@ng-icons/font-awesome/solid';

interface Menu {
  id: number;
  link: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgIcon, RouterLinkActive],
  providers: [
    provideIcons({
      faSolidDumbbell,
      faSolidUser,
      faSolidUserGroup,
      faSolidWrench,
      faSolidHouse,
      faSolidBars,
      faSolidBell,
      faSolidFolder,
    }),
  ],
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
      icon: 'faSolidHouse',
    },
    {
      id: 2,
      link: '/admin/users',
      label: 'Usuarios',
      icon: 'faSolidUser',
    },
    {
      id: 22,
      link: '/admin/measures',
      label: 'Medidas',
      icon: 'faSolidUserGroup',
    },
    {
      id: 3,
      link: '/admin/routines',
      label: 'Rutinas',
      icon: 'faSolidFolder',
    },
    {
      id: 4,
      link: '/admin/exercises',
      label: 'Ejercicios',
      icon: 'faSolidDumbbell',
    },
    {
      id: 5,
      link: '/admin/catalogs',
      label: 'Catálogos',
      icon: 'faSolidBars',
    },
    {
      id: 6,
      link: '/admin/profile',
      label: 'Mi Perfil',
      icon: 'faSolidUser',
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
