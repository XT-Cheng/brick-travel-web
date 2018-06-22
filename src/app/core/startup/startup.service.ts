import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { TokenService } from '@core/auth/providers/tokenService';
import { TokenStorage } from '@core/auth/providers/tokenStorage';
import { CityService } from '@core/store/providers/city.service';
import { DataFlushService } from '@core/store/providers/dataFlush.service';
import { MasterDataService } from '@core/store/providers/masterData.service';
import { RootEpics } from '@core/store/store.epic';
import { IAppState, INIT_APP_STATE } from '@core/store/store.model';
import { rootReducer } from '@core/store/store.reducer';
import { deepExtend } from '@core/utils/helpers';
import { Menu, MenuService, SettingsService } from '@delon/theme';
import { Storage } from '@ionic/storage';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { stateTransformer } from 'redux-seamless-immutable';
import * as Immutable from 'seamless-immutable';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  private testMenuItem = {
    text: 'Test',
    icon: 'icon-speedometer',
    link: '/test'
  };

  private cityMenuItem = {
    text: 'City',
    icon: 'icon-speedometer',
    link: '/city'
  };

  private viewPointMenuItem = {
    text: 'View Point',
    icon: 'icon-speedometer',
    children: []
  };

  private travelAgendaMenuItem = {
    text: 'Travel Agenda',
    icon: 'icon-speedometer',
    link: '/travelAgenda'
  };

  private mainNavMenuItem = {
    text: 'Main',
    group: true,
    icon: 'icon-speedometer',
    children: [
      this.testMenuItem, this.cityMenuItem, this.viewPointMenuItem
    ]
  };

  constructor(
    private _menuService: MenuService,
    private _settingService: SettingsService,
    private _store: NgRedux<IAppState>,
    private _cityService: CityService,
    private _rootEpics: RootEpics,
    private _dataFlushService: DataFlushService,
    private _masterService: MasterDataService,
    private _storage: Storage,
    private _tokenService: TokenService,
    private _httpClient: HttpClient,
    private _injector: Injector
  ) {
    this._cityService.all$.subscribe(cities => {
      cities.forEach((city) => {
        this.viewPointMenuItem.children.push({
          text: city.name,
          link: `/viewPoint/${city.id}`,
          icon: 'icon-speedometer'
        });
      });
      this._menuService.add([this.mainNavMenuItem]);
    });
  }

  private viaHttp(resolve: any, reject: any) {
    this._dataFlushService.restoreState().then((restoredState) => {
      const epicMiddleware = createEpicMiddleware();
      this._store.configureStore(
        rootReducer,
        <any>Immutable(deepExtend(INIT_APP_STATE, restoredState)),
        [createLogger({ stateTransformer: stateTransformer }), epicMiddleware]);

      epicMiddleware.run(this._rootEpics.createEpics());

    }).then(() =>
      this._storage.get(TokenStorage.TOKEN_KEY)
    ).then((value) =>
      this._tokenService.setRaw(value)
    ).then((_) =>
      this._masterService.fetch()
    ).then((_) => {
      resolve(null);
    });
  }

  private prepareMenu(): Menu[] {
    return [this.testMenuItem, this.cityMenuItem, this.viewPointMenuItem, this.travelAgendaMenuItem];
  }

  //   zip(
  //     this.httpClient.get('assets/tmp/app-data.json')
  //   ).pipe(
  //     // 接收其他拦截器后产生的异常消息
  //     catchError(([appData]) => {
  //       resolve(null);
  //       return [appData];
  //     })
  //   ).subscribe(([appData]) => {

  //     // application data
  //     const res: any = appData;
  //     // 应用信息：包括站点名、描述、年份
  //     this.settingService.setApp(res.app);
  //     // 用户信息：包括姓名、头像、邮箱地址
  //     this.settingService.setUser(res.user);
  //     // ACL：设置权限为全量
  //     this.aclService.setFull(true);
  //     // 初始化菜单
  //     this.menuService.add(res.menu);
  //     // 设置页面标题的后缀
  //     this.titleService.suffix = res.app.name;
  //   },
  //     () => { },
  //     () => {
  //       resolve(null);
  //     });
  // }

  // private viaMock(resolve: any, reject: any) {
  //   // const tokenData = this.tokenService.get();
  //   // if (!tokenData.token) {
  //   //   this.injector.get(Router).navigateByUrl('/passport/login');
  //   //   resolve({});
  //   //   return;
  //   // }
  //   // mock
  //   const app: any = {
  //     name: `ng-alain`,
  //     description: `Ng-zorro admin panel front-end framework`
  //   };
  //   const user: any = {
  //     name: 'Admin',
  //     avatar: './assets/tmp/img/avatar.jpg',
  //     email: 'cipchk@qq.com',
  //     token: '123456789'
  //   };
  //   // 应用信息：包括站点名、描述、年份
  //   this.settingService.setApp(app);
  //   // 用户信息：包括姓名、头像、邮箱地址
  //   this.settingService.setUser(user);
  //   // ACL：设置权限为全量
  //   this.aclService.setFull(true);
  //   // 初始化菜单
  //   this.menuService.add([
  //     {
  //       text: '主导航',
  //       group: true,
  //       children: [
  //         {
  //           text: '仪表盘',
  //           link: '/dashboard',
  //           icon: 'anticon anticon-appstore-o'
  //         },
  //         {
  //           text: '快捷菜单',
  //           icon: 'anticon anticon-rocket',
  //           shortcut_root: true
  //         }
  //       ]
  //     }
  //   ]);
  //   // 设置页面标题的后缀
  //   this.titleService.suffix = app.name;

  //   resolve({});
  // }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      // this.viaMock(resolve, reject);
    });
  }
}
