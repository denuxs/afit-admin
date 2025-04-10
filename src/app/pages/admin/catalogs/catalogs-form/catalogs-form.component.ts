import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';

import { Catalog, CatalogDto } from 'app/domain';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-catalogs-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, RouterLink],
  providers: [MessageService],
  templateUrl: './catalogs-form.component.html',
  styleUrl: './catalogs-form.component.scss',
})
export class CatalogsFormComponent implements OnInit {
  private readonly _formBuilder = inject(UntypedFormBuilder);

  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();

  @Input() catalog: Catalog | null = null;
  @Output() formChange: EventEmitter<any> = new EventEmitter<any>();

  catalogForm: FormGroup;

  catalogTypes = [
    {
      name: 'Musculo',
      id: 'muscle',
    },
    {
      name: 'Equipo',
      id: 'equipment',
    },
  ];

  constructor() {
    this.catalogForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      key: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.catalog) {
      this.setFormValue(this.catalog);
    }
  }

  setFormValue(catalog: Catalog) {
    const form = {
      name: catalog.name,
      key: catalog.key,
    };
    this.catalogForm.patchValue(form);
  }

  handleSubmit(): void {
    if (this.catalogForm.invalid) {
      this.catalogForm.markAllAsTouched();
      return;
    }

    const { name, key } = this.catalogForm.value;

    const form: CatalogDto = {
      name,
      key,
    };

    this.formChange.emit(form);

    // const errors = error.error;
    // for (let key in errors) {
    //   this.catalogForm.get(key)?.setErrors({
    //     error: errors[key],
    //   });
    // }

    // this.catalogForm.setErrors({
    //   error: 'Error al guardar el catalogo',
    // });
  }

  checkErrors(field: string): string {
    const form: any = this.catalogForm.get(field);

    if (form.invalid && (form.dirty || form.touched)) {
      if (form?.hasError('required')) {
        return 'Campo requerido';
      }

      // if (form?.hasError('error')) {
      //   return 'Campo es requerido from db';
      // }
    }
    return '';
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
