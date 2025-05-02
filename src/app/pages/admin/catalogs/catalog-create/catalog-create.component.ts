import { Component } from '@angular/core';
import { CatalogsFormComponent } from '../catalogs-form/catalogs-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalog-create',
  standalone: true,
  imports: [CatalogsFormComponent, RouterLink],
  templateUrl: './catalog-create.component.html',
  styleUrl: './catalog-create.component.scss',
})
export class CatalogCreateComponent {}
