import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { zipAll } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private fb: FormBuilder, private http: HttpClient) {}
  readonly BaseURI = 'http://localhost:61571/api';

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group(
      {
        Password: ['', [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ['', Validators.required],
      },
      { validators: this.comparePasswords }
    ),
  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    // passwordMismatch
    // ConfirmPswrdCtrl.errors={passwordMismatch:true}

    if (
      confirmPswrdCtrl.errors == null ||
      'passwordMismatch' in confirmPswrdCtrl.errors
    ) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password,
    };

    return this.http.post(this.BaseURI + '/ApplicationUser/Register', body);
  }

  login(formData) {
    return this.http.post(this.BaseURI + '/ApplicationUser/Login', formData);
  }

  getUserProfile() {
    // var tokenHeader = new HttpHeaders({
    //   Authorization: 'Bearer ' + localStorage.getItem('token'),
    // });

    // thay the thanh
    // auth.interceptor.ts

    return this.http.get(this.BaseURI + '/UserProfile');
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var payload = JSON.parse(
      window.atob(localStorage.getItem('token').split('.')[1])
    );
    var userRole = payload.role;

    allowedRoles.forEach((element) => {
      if (userRole == element) {
        isMatch = true;
        return false; // vong lap
      }
    });

    return isMatch;
  }
}
