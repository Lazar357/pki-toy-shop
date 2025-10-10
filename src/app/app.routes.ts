import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';

export const routes: Routes = [
    {path: 'home', title: 'Home', component: Home},
    { path: 'details/:toyId', title: 'Details', component: Details }
];
