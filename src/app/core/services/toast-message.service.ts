import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  private _message: Subject<string> = new Subject<string>();
  message$ = this._message.asObservable();

  constructor() {}

  sendMessage(message: string) {
    this._message.next(message);
  }
}
