import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toys',
  imports: [RouterLink],
  templateUrl: './toys.html',
  styleUrl: './toys.css'
})
export class Toys {
  protected toys = signal<ToyModel[]>([])

  public getImage(url: string) {
    return `https://toy.pequla.com${url}`
  }

  constructor() {
    ToyService.getAllToys()
      .then(rsp => this.toys.set(rsp.data))
    console.log(this.toys())
  }
}
