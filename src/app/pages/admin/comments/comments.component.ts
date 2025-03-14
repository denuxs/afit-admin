import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Comment } from 'app/domain';
import { CommentService } from 'app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe, RouterLink, NgIf, AsyncPipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  private readonly _commentService = inject(CommentService);

  comments$!: Observable<Comment[]>;

  ngOnInit(): void {
    this.comments$ = this._commentService.fetchComments();
  }
}
