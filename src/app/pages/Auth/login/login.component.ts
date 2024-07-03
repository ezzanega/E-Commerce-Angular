import { CartService } from 'src/app/services/cartService/cart.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { AuthserviceService } from 'src/app/services/auth/authservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from 'src/app/Models/auth-response.model';
import { GoogleUser } from 'src/app/Models/google-signin.model';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // user: User | null  = null;

  constructor(
    private authService: AuthserviceService,
    private router: Router,
    private CartService: CartService,
    private toastr: ToastrService,
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.googleInit();
  }

  credentials = { email: '', password: '' };
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  errorMessage: string = '';
  errorLoginMessage: string = '';


  googleLoader:boolean = false;
  googleLoginLoader:boolean = false;

  googleInit() {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: '272393076936-2rnn790ve602f4afdngq8ka5r9gbvh04.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email',
        plugin_name: 'ecommerce',
      });
      console.log('Google Auth Initialized', auth2);

      const googleRegisterBtn = document.getElementById('googleRegisterBtn');
      if (googleRegisterBtn) {
        console.log('googleRegisterBtn');

        this.attachSignUp(googleRegisterBtn, auth2);
      } else {
        console.error('Google Login button not found');
      }

      const googleLoginBtn = document.getElementById('googleLoginBtn');

      if(googleLoginBtn) {
        console.log('googleLoginBtn');
        this.attachSignIn(googleLoginBtn, auth2);
      } else {
        console.error('Google Login button not found');
      }

    });
  }

  onGoogleSignInClick() {
    this.googleLoader = true;
    this.errorMessage = '';

  }

  googleLoginStartLoader() {
    this.googleLoginLoader = true;
    this.errorLoginMessage = '';
  }



  attachSignUp(element: HTMLElement, auth2: any) {
    this.errorMessage = '';

    auth2.attachClickHandler(
      element,
      {},
      (googleUser: GoogleUser) => {
        const profile = googleUser.getBasicProfile();
        console.log('User Profile:', {
          ID: profile.getId(),
          FullName: profile.getName(),
          GivenName: profile.getGivenName(),
          FamilyName: profile.getFamilyName(),
          ImageURL: profile.getImageUrl(),
          Email: profile.getEmail(),
        });
        const idToken = googleUser.getAuthResponse().id_token;
        this.sendTokenToBackend(idToken);
      },
      (error: any) => {
        this.googleLoader = false; // Hide loader on error
        console.log('Google Sign-In error:', JSON.stringify(error, undefined, 2));
        this.toastr.error('Google Sign-In failed');
      }
    );
  }



  attachSignIn(element: HTMLElement, auth2: any) {
    this.errorLoginMessage = '';

    auth2.attachClickHandler(
      element,
      {},
      (googleUser: GoogleUser) => {
        const profile = googleUser.getBasicProfile();
        console.log('User Profile:', {
          ID: profile.getId(),
          FullName: profile.getName(),
          GivenName: profile.getGivenName(),
          FamilyName: profile.getFamilyName(),
          ImageURL: profile.getImageUrl(),
          Email: profile.getEmail(),
        });
        const idToken = googleUser.getAuthResponse().id_token;
         this.sendTokenToLoginWithGoogleBackend(idToken);
      },
      (error: any) => {
        this.googleLoader = false; // Hide loader on error
        console.log('Google Sign-In error:', JSON.stringify(error, undefined, 2));
        this.toastr.error('Google Sign-In failed');
      }
    );
  }

  sendTokenToBackend(token: string) {
    this.authService.googleSignUp(token).subscribe(
      (response: any) => {
        console.log(response);

        if (response.access_token) {
          this.authService.saveToken(response.access_token, response.expires_in);
          this.toastr.success('Register Success!');
          // Run the navigation inside Angular zone
          this.ngZone.run(() => {
            this.router.navigate(['/']).then(() => {
              this.googleLoader = false; // Hide loader after navigation
            }).catch((error) => {
              console.error('Navigation error:', error);
              this.googleLoader = false; // Hide loader if navigation fails
            });
          });
        }  else if (response.error) {
          this.googleLoader = false;
          this.errorMessage = response.error;
          this.toastr.error(response.error);
        }
      },
      (error) => {
        this.googleLoader = false;
        if (error.error) {
          if (typeof error.error === 'object' && error.error.error) {
            this.errorMessage = error.error.error;
            this.toastr.error(error.error.error);
          } else {
            this.errorMessage = JSON.stringify(error.error);
            this.toastr.error(this.errorMessage);
          }
        } else {
          this.errorMessage = 'Google Sign-In failed';
          this.toastr.error('Google Sign-In failed');
        }
      }
    );
  }


  sendTokenToLoginWithGoogleBackend(token: string) {
    this.authService.googleLogin(token).subscribe(
      (response: any) => {
        if (response.access_token) {
          this.authService.saveToken(response.access_token, response.expires_in);
          this.toastr.success('Login Success!');
          // Run the navigation inside Angular zone
          this.ngZone.run(() => {
            this.router.navigate(['/']).then(() => {
              this.googleLoader = false;
            }).catch((error) => {
              console.error('Navigation error:', error);
              this.googleLoader = false;
            });
          });
        }  else if (response.error) {
          this.googleLoginLoader = false;
          this.errorLoginMessage = response.error;
          this.toastr.error(response.error);
        }
      },
      (error) => {
        this.googleLoginLoader = false;
        if (error.error) {
          if (typeof error.error === 'object' && error.error.error) {
            this.errorLoginMessage = error.error.error;
            this.toastr.error(error.error.error);
          } else {
            this.errorLoginMessage = JSON.stringify(error.error);
            this.toastr.error(this.errorLoginMessage);
          }
        } else {
          this.errorLoginMessage = 'Google Sign-In failed';
          this.toastr.error('Google Sign-In failed');
        }
      }
    );
  }


  login() {
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe(
      (response: AuthResponse) => {
        this.authService.saveToken(response.access_token, response.expires_in);
        this.router.navigate(['/']);
      },
      (error) => {
        // this.errorLoginMessage = 'Login error :  '+ error.error.error ;
        // this.toastr.error('Login error ' , error.error.error );
        console.log(error)
        if (error.error) {
          for (const key in error.error) {
            if (error.error.hasOwnProperty(key)) {
              this.errorLoginMessage =
                'Login error: ' + error.error[key][0];
              this.toastr.error(
                'Login error: ' + error.error[key][0]
              );
            }
          }
        }
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
          (response: AuthResponse) => {
            this.authService.saveToken(
              response.access_token,
              response.expires_in
            );
            this.toastr.success('Register Success!');
            this.router.navigate(['/']);
          },
          (error) => {
            if (error.error) {
              for (const key in error.error) {
                if (error.error.hasOwnProperty(key)) {
                  this.errorMessage =
                    'Registration error: ' + error.error[key][0];
                  this.toastr.error(
                    'Registration error: ' + error.error[key][0]
                  );
                }
              }
            }
          }
        );
    } else {
      console.error('Passwords do not match');
      this.errorMessage = 'Passwords do not match';
      this.toastr.error('Passwords do not match');
    }
  }
}
