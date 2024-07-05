import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  public loggedIn = signal<boolean>(false);
  constructor() { }
}
