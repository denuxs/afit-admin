import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Post } from 'app/domain';
import { PostService } from 'app/services/post.service';

import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink, TableModule, TooltipModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  private readonly _postService = inject(PostService);

  posts$!: Observable<Post[]>;

  ngOnInit(): void {
    this.posts$ = this._postService.fetchPosts();
  }
}
