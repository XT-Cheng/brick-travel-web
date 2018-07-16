import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@core/auth/providers/tokenService';
import { UserService } from '@core/store/providers/user.service';
import { AUTH_URL } from '@core/utils/constants';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="(userService.loggedIn$ | async).picture" nzSize="small" class="mr-sm"></nz-avatar>
      {{(userService.loggedIn$ | async).name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
      <div nz-menu-item [nzDisabled]="true"><i class="anticon anticon-setting mr-sm"></i>设置</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent implements OnInit {
  constructor(
    public userService: UserService,
    private _tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.userService.change().subscribe((res: any) => {
    //   this.settings.setUser(res);
    // });
    // mock
    // const token = this.tokenService.get() || {
    //   token: 'nothing',
    //   name: 'Admin',
    //   avatar: './assets/logo-color.svg',
    //   email: 'cipchk@qq.com',
    // };
    // this.tokenService.set(token);
  }

  logout() {
    this._tokenService.clear();
    this.router.navigateByUrl(AUTH_URL);
  }
}
