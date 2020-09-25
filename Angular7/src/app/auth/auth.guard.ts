import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // add constructor
  constructor(private router: Router, private service: UserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem('token') != null) {
      // permittedRoles app-routing.module.ts
      let roles = next.data['permittedRoles'] as Array<string>;
      // roles = ["Admin"]

      if (roles) {
        if (this.service.roleMatch(roles)) return true;
        else {
          this.router.navigate(['/forbidden']);
        }
      }

      return true;
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }
}
