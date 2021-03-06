import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
const secretKey = 'MyVerySecretKey';

@Injectable({
  providedIn: 'root'
})
export class Services {

  sessionObj: {}
  constructor(private router: Router, private http: HttpClient) { }

  //#region Encryption 
  
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, secretKey).toString();
  }

  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, secretKey).toString(CryptoJS.enc.Utf8);
  }

  //#endregion


  isAuthenticated(): boolean {
    if (localStorage.getItem('authToken') != null) return true;
    this.router.navigateByUrl('/login');
    return false;
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set('X-OBSERVATORY-AUTH', localStorage.getItem('authToken'));
  }

  getUserRole(): string {
    if (this.isAuthenticated()) {

      let jwtData = localStorage.getItem('authToken').split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      return decodedJwtData.user.role;
    }
    return '';
  }

  getUserName(): string {
    if (this.isAuthenticated()) {

      let jwtData = localStorage.getItem('authToken').split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      return decodedJwtData.user.name;
    }
    return '';
  }

  getOwnerID(): string {
    if (this.isAuthenticated()) {

      let jwtData = localStorage.getItem('authToken').split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      return decodedJwtData.user.owner_id;
    }
    return '';
  }

  getAdminID(): string {
    if (this.isAuthenticated()) {

      let jwtData = localStorage.getItem('authToken').split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      return decodedJwtData.user.administrator_id;
    }
    return '';
  }

  logout() {
    if (this.isAuthenticated()) {
      let url = 'http://localhost:8765/evcharge/api/logout';
      let body = {};
      this.http.post(url, body, { headers: this.getAuthHeaders() }).subscribe()
      localStorage.clear();
      this.router.navigateByUrl('/logout');
    }
  }

}
