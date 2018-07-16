import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@core/auth/providers/tokenService';
import { UserService } from '@core/store/providers/user.service';
import { AUTH_URL } from '@core/utils/constants';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(private _tokenService: TokenService,
    public userService: UserService,
    private router: Router) {
  }

  logout() {
    this._tokenService.clear();
    this.router.navigateByUrl(AUTH_URL);
  }
}
