import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { RouterLink } from "@angular/router"
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
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
