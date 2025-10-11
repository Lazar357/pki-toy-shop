import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ActivatedRoute } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  protected toy = signal<ToyModel | null>(null)
  protected other = signal<ToyModel[]>([])

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params: any) => {
      ToyService.getToyById(params.toyId)
        .then(rsp => {
          console.log(rsp.data)
          this.toy.set(rsp.data)
          ToyService.getToyByPermalink(rsp.data.permalink)
            .then(rsp => {
              this.other.set(rsp.data.content)
            })
        })
    })
  }

  public getImage(url: string) {
    return `https://toy.pequla.com${url}`
  }
}
