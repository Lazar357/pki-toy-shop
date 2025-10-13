import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { Utils } from './utils';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(protected router: Router, protected utils: Utils) { }

  hasAuth() {
    if (localStorage.getItem('active'))
      return true
    return false
  }
  logout() {
    this.utils.showConfirm('Da li ste sigurni da zelite da se odjavite?', () => {
      UserService.logout()
        this.router.navigateByUrl('/')
    })

  }
}
