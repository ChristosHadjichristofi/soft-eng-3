import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Services } from '../providers/services';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  
  form: FormGroup;
  
  roles: { text: string, value: string }[] = 
    [
      { text: 'Driver', value: 'user' }, 
      { text: 'Station Admin', value: 'admin' }
    ];

  get inputUsername() { return this.form.get('inputUsername'); }
  get inputPassword() { return this.form.get('inputPassword'); }
  get inputRole() { return this.form.get('inputRole'); }

  constructor(public toastr: ToastrService, private http: HttpClient, private router: Router, public services: Services) {
    this.form = new FormGroup({
      inputRole: new FormControl(this.roles[0].value, Validators.required),
      inputUsername: new FormControl(null, Validators.required),
      inputPassword: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {}

  attemptLogin() { (this.form.valid) ? this.login() : this.toastr.error("Form invalid!"); }

  login(): void {
    var url = 'https://localhost:8765/evcharge/api/login?isAdministrator=';

    var body = {
      email: this.inputUsername.value,
      password: this.inputPassword.value
    };
    
     url += (this.inputRole.value === 'admin') ? 'true' : 'false';

    this.http.post<{role: string, token: string}>(url, body).subscribe(result => {
      localStorage.setItem('authToken', result.token);
      var role = this.services.getUserRole();

      if (role == 'owner') {
        this.router.navigateByUrl('/owner');
        
      }
      else if (role == 'stationadmin'){
        this.router.navigateByUrl('/stationadmin');
        
      }

    }, (error => {
      console.log(error)
    }));
  }
}
