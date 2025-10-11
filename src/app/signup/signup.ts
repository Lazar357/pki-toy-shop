import { Component, computed, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  protected form: FormGroup
  protected toys = signal<ToyModel[]>([])
  protected uniqueTypes = computed(() => [...new Set(this.toys().map(toy => toy.type.name))])

  constructor(private formBuilder: FormBuilder, protected router: Router) {
    ToyService.getAllToys()
    .then(rsp=> this.toys.set(rsp.data))


    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      favoriteToyType: ['', Validators.required]

    })
  }

  onSubmit() {
    if (!this.form.valid) {
      alert('Invalid form data!')
      return
    }

    if (this.form.value.password !== this.form.value.repeatPassword) {
      alert(`Passwords don't match!`)
      return
    }

    try {
      const formValue: any = this.form.value
      delete formValue.repeatPassword
      UserService.signup(formValue)
      this.router.navigateByUrl('/login')
    } catch (e) {
      console.error(e)
      alert('Data missing!')
    }
  }

}
