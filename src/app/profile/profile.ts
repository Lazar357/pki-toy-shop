import { Component, computed, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Utils } from '../utils';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToyModel } from '../../models/toy.model';
import { UserModel } from '../../models/user.model';
import Swal from 'sweetalert2';
import { ToyService } from '../../services/toy.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  protected profileForm: FormGroup
  protected passwordForm: FormGroup
  protected currentUser = signal<UserModel | null>(null)
  protected toys = signal<ToyModel[]>([])
  protected uniqueTypes = computed(() => [...new Set(this.toys().map(toy => toy.type.name))])

  constructor(private formBuilder: FormBuilder, private router: Router, public utils: Utils) {
    ToyService.getAllToys()
      .then(rsp => {
        this.toys.set(rsp.data)
      })

    try {
      this.utils.showLoading()
      this.currentUser.set(UserService.getActiveUser())
    } catch {
      this.router.navigate(['/login'])
    }

    this.profileForm = this.formBuilder.group({
      firstName: [this.currentUser()!.firstName, Validators.required],
      lastName: [this.currentUser()!.lastName, Validators.required],
      phone: [this.currentUser()!.phone, Validators.required],
      favoriteToy: [this.currentUser()?.favoriteToyType, Validators.required]
    })

    this.passwordForm = this.formBuilder.group({
      old: ['', Validators.required],
      new: ['', Validators.required],
      repeat: ['', Validators.required]
    })

    Swal.close()
  }

  protected onProfileSubmit() {
    this.utils.showConfirm('Da li ste sigurni da zelite da azurirate profil?', () => {
      if (!this.profileForm.valid) {
        this.utils.showError('Lose uneti podaci u formu!')
        return
      }

      UserService.updateUser(this.profileForm.value)
      this.utils.showAlert('Profil je azuriran!')
    })
  }

  protected onPasswordSubmit() {
    this.utils.showConfirm('Da li ste sigurni da zelite da promenite lozinku?', () => {
      if (!this.passwordForm.valid) {
        this.utils.showError('Lose uneti podaci u formu')
        return
      }

      const old = this.currentUser()!.password
      if (old != this.passwordForm.value.old) {
        this.utils.showError('Trenutna lozinka nije ispravno uneta!')
        return
      }

      if (this.passwordForm.value.new != this.passwordForm.value.repeat) {
        this.utils.showError("Lozinke nisu iste!")
        return
      }

      UserService.updateUserPassword(this.passwordForm.value.new)
      this.utils.showAlert("Lozinka je promenjena! Molimo Vas da se prijavite opet.")
      UserService.logout()
      this.router.navigateByUrl('/login')
    })
  }
}
