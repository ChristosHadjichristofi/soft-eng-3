import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../providers/services';

interface NavItem {
  text: string;
  route: string;
  onclick: string;
  canAccess: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerLinks: NavItem[] = [
    { text: 'Points', route: 'sessionsPerPoint', onclick: 'null', canAccess: 'stationadmin' }
    , { text: 'Stations', route: 'sessionsPerStation', onclick: 'null', canAccess: 'stationadmin' }
    , { text: 'Providers', route: 'sessionsPerProvider', onclick: 'null', canAccess: 'stationadmin' }
    , { text: 'Sessions Per EV', route: 'sessionsPerEV', onclick: 'null', canAccess: 'owner' }
    , { text: 'Charge', route: 'charge', onclick: 'null', canAccess: 'owner' }
    , { text: 'Map', route: 'map', onclick: 'null', canAccess: 'owner' }
    , { text: 'Invoice', route: 'invoice', onclick: 'null', canAccess: 'owner,stationadmin' }
    , { text: 'Logout', route: 'logout', onclick: "logout", canAccess: 'owner,stationadmin' }
  ];
  constructor(private services: Services, private router: Router) { }

  ngOnInit(): void { }

  showNavItems(): boolean {
    return !(
      this.router.url == '/'
      || this.router.url == '/login'
      || this.router.url == '/landing'
      || this.router.url == '/owner'
      || this.router.url == '/stationadmin'
      || this.router.url == '/payment'
      || this.router.url == '/rating'
      || this.router.url == '/logout'
    );
  }

  getNavItemsForUser(): NavItem[] {
    return this.headerLinks.filter(x => x.canAccess.split(',').find(x => x == this.services.getUserRole()))
  }

  navItemOnClick(onclick: string, route: string) {
    if (onclick == 'null') this.router.navigateByUrl(route);
    else this.services.logout();
  }

}
