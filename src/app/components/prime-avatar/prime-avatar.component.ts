import { Component, Input, OnInit } from '@angular/core';

import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-prime-avatar',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './prime-avatar.component.html',
  styleUrl: './prime-avatar.component.scss',
})
export class PrimeAvatarComponent implements OnInit {
  @Input() avatar!: string;

  ngOnInit(): void {
    if (!this.avatar) {
      this.avatar = 'default.jpg';
    }
  }
}
