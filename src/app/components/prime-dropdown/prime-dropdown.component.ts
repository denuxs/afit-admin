import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-prime-dropdown',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, AutoCompleteModule],
  templateUrl: './prime-dropdown.component.html',
  styleUrl: './prime-dropdown.component.scss',
})
export class PrimeDropdownComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() placeholder = '';
  @Input() help = '';
  @Input() data!: any;

  filteredData: any[] = [];

  handleFilter(event: AutoCompleteCompleteEvent) {
    const term = event.query.toLowerCase();

    const filtered = this.data.filter((item: any) =>
      item.name.toLowerCase().includes(term)
    );

    this.filteredData = filtered;
  }
}
