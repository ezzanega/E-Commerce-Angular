import { CartService } from 'src/app/services/cartService/cart.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  user: User | null  = null;

  constructor(
    private authService: AuthserviceService,
    private router: Router,
    private CartService: CartService,
    private toastr :ToastrService,
    public auth0Service: Auth0Service
  ) {}


  ngOnInit() {
    this.auth0Service.user$.subscribe((user:any) => {
      this.user = user;
      if (user) {
        this.authService.googleSignUp(user.sub).subscribe(
          response => {
            this.authService.saveToken(response.token, response.expires_in);
            this.router.navigate(['/']);
          },
          error => {
            console.error('Google sign-up error', error);
          }
        );
      }
    });
  }

  credentials = { email: '', password: '' };
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';



  signInWithGoogle(): void {
    this.auth0Service.loginWithRedirect();
  }


  login() {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe(
      (response) => {
        this.authService.saveToken(response.access_token, response.expires_in);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login error', error);
        this.errorMessage = 'Login error :  ' + error;
      }
    );
  }

  register() {
    this.errorMessage = '';
    if (this.password === this.confirmPassword) {
      const user = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
      };

      this.authService
        .register(user)
        .pipe(
          switchMap(() => {
            const credentials = {
              email: this.email,
              password: this.password,
            };
            return this.authService.login(credentials);
          })
        )
        .subscribe(
          (response) => {
            this.authService.saveToken(
              response.access_token,
              response.expires_in
            );
            this.toastr.success('Register Success !' );
            this.router.navigate(['/']);
          },
          (error) => {

            if (error.error) {
              for (const key in error.error) {
                if (error.error.hasOwnProperty(key)) {
                  this.errorMessage = 'Registration  error : ' +  error.error[key][0];
                }
              }
            }
          }
        );
    } else {
      console.error('Passwords do not match');
      this.errorMessage = 'Passwords do not match';
    }
  }

}
