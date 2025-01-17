import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService : AuthserviceService , private router : Router) {}
  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  
  }

}
