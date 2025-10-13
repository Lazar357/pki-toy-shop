import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { RouterLink } from '@angular/router';
import { Utils } from '../utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-toys',
  imports: [RouterLink],
  templateUrl: './toys.html',
  styleUrl: './toys.css'
})
export class Toys {
  protected toys = signal<ToyModel[]>([])

  constructor(protected utils: Utils) {
    this.utils.showLoading()
    ToyService.getAllToys()
      .then(rsp => this.toys.set(rsp.data))
    console.log(this.toys())
    Swal.close()
  }
}
