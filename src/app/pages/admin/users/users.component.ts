import { Component, inject, OnInit } from '@angular/core';
import { User } from 'app/domain';
import { UserService } from 'app/services';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private readonly _userService = inject(UserService);

  users$!: Observable<User[]>;

  ngOnInit(): void {
    this.users$ = this._userService.getUsers();
  }
}
