import { HttpClient } from '@angular/common/http';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Services } from '../providers/services';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  roles: { text: string, value: string }[] = 
    [
      { text: 'User', value: 'user' }, 
      { text: 'Admin', value: 'admin' }
    ];


  inputUsername: string;
  inputPassword: string;
  inputRole: string = this.roles[0].value;

  constructor(private http: HttpClient, private router: Router, private services: Services) {}

  ngOnInit(): void {}

  login(): void {
    var url = 'http://localhost:8765/evcharge/api/login?isAdministrator=';

    var body = {
      email: this.inputUsername,
      password: this.inputPassword
    };
    
     url += (this.inputRole === 'admin') ? 'true' : 'false';

    this.http.post<{role: string, token: string}>(url, body).subscribe(result => {
      localStorage.setItem('authToken', result.token)
      let role =this.services.getUserRole();

      //let url = role == 'owner' ? 'sessionsPerEV' 
      this.router.navigateByUrl('/sessionsPerEV')

    }, (error => {
      console.log(error)
    }));
  }
}
