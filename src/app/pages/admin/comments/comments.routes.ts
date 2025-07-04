import { Routes } from '@angular/router';

import { CommentsComponent } from './comments.component';
import { CommentViewComponent } from './comment-view/comment-view.component';

export default [
  {
    path: '',
    component: CommentsComponent,
  },
  {
    path: ':id/view',
    component: CommentViewComponent,
  },
] as Routes;
