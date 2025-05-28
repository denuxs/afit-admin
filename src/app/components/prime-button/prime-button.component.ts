import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-prime-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './prime-button.component.html',
  styleUrl: './prime-button.component.scss',
})
export class PrimeButtonComponent {
  @Input() label!: string;
  @Input() loading = false;
}
