import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';

import { Comment } from 'app/domain';
import { CommentService } from 'app/services';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { DynamicDialog } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

import { CommentViewComponent } from './comment-view/comment-view.component';
import { TimeAgoPipe } from 'app/pipes/time-ago.pipe';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    RouterLink,
    ButtonModule,
    TimeAgoPipe,
  ],
  providers: [ConfirmationService, DialogService],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _commentService = inject(CommentService);
  private readonly _confirmationService = inject(ConfirmationService);

  comments$!: Observable<Comment[]>;

  filterForm: FormGroup;

  ref: DynamicDialogRef | undefined;
  private readonly _dialogService = inject(DialogService);

  constructor() {
    this.filterForm = this._formBuilder.group({
      search: ['', []],
    });
  }

  ngOnInit(): void {
    this.getComments({ search: '' });
  }

  getComments(params: any): void {
    params['ordering'] = '-id';
    this.comments$ = this._commentService.fetchComments(params);
    // .pipe(
    //   map(response => {
    //     const groupedData = this.groupByUser(response);
    //     return this.getLastCommentByUser(groupedData);
    //   })
    // );
  }

  groupByUser(data: any): any {
    return data.reduce(
      (acc: any, comment: any) => {
        acc[comment.user.id] = [...(acc[comment.user.id] || []), comment];
        return acc;
      },
      {} as Record<number, Comment[]>
    );
  }

  getLastCommentByUser(data: any): any {
    return Object.values(data).map(
      (item: any) => item.sort((a: any, b: any) => b.id - a.id)[0]
    );
  }

  handleFilter() {
    const { search } = this.filterForm.value;
    this.getComments({ search });
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
        this.getComments({ search: '' });
      },
    });
  }

  showModal() {
    this.ref = this._dialogService.open(CommentViewComponent, {
      header: '',
      modal: true,
      closable: true,
      // showHeader: false,
      focusOnShow: false,
      data: {
        id: '51gF3',
      },
    });
  }
}
