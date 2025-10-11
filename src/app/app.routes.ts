import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Toys } from './toys/toys';
import { Login } from './login/login';
import { Profile } from './profile/profile';
import { Signup } from './signup/signup';

export const routes: Routes = [
    { path: '', title: 'Home', component: Home },
    { path: 'details/:toyId', title: 'Details', component: Details },
    { path: 'toys', title: 'Toys', component: Toys },
    { path: 'login', title: 'Login', component: Login},
    { path: 'signup', title: 'Signup', component: Signup},
    { path: 'profile', title: 'Profile', component: Profile}
];
