import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Comment } from 'app/domain';
import { CommentService } from 'app/services';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    AsyncPipe,
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _commentService = inject(CommentService);
  private readonly _confirmationService = inject(ConfirmationService);

  comments$!: Observable<Comment[]>;

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments(params?: { search?: string; key?: string }): void {
    this.comments$ = this._commentService.fetchComments({
      ...params,
    });
  }

  handleFilter() {
    const params = this.filterForm.value;
    this.getComments(params);
  }

  handleDelete(id: number): void {
    this._confirmationService.confirm({
      message: 'Seguro que desea borrar este comentario?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-outlined p-button-secondary',
      accept: () => {
        this.deleteComment(id);
      },
    });
  }

  deleteComment(id: number): void {
    this._commentService.deleteComment(id).subscribe({
      next: () => {
        this.getComments();
      },
      error: () => {
        console.error('Error deleting comment');
      },
    });
  }
}
