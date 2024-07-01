import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/menuService/menu.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {

  menuVisible = false;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.menuVisible$.subscribe(visible => {
      this.menuVisible = visible;
    });
  }

  closeMenu() {
    this.menuService.toggleMenu();
  }
}
