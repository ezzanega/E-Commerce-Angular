import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private menuVisibleSubject = new BehaviorSubject<boolean>(false);
  menuVisible$ = this.menuVisibleSubject.asObservable();

  constructor() { }

  toggleMenu() {
    this.menuVisibleSubject.next(!this.menuVisibleSubject.value);
  }

  
}
