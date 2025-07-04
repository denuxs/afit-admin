import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Comment } from 'app/domain';
import { CommentService } from 'app/services';

@Component({
  selector: 'app-comment-view',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './comment-view.component.html',
  styleUrl: './comment-view.component.scss',
})
export class CommentViewComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _commentService = inject(CommentService);

  contentType: number = 11;

  comments$!: Observable<Comment[]>;

  ngOnInit(): void {
    // const userId = this._route.snapshot.paramMap.get('id');
    // if (userId) {
    //   this.getComments({
    //     user: Number(userId),
    //     content_type: this.contentType,
    //   });
    // }
  }

  getComments(params: { user: number; content_type: number }): void {
    this.comments$ = this._commentService.fetchComments(params);
  }
}
