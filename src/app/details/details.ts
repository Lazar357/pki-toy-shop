import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ActivatedRoute } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { Utils } from '../utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details {
  protected toy = signal<ToyModel | null>(null)
  protected other = signal<ToyModel[]>([])

  constructor(private route: ActivatedRoute, protected utils: Utils) {
    this.utils.showLoading()
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
    Swal.close()
  }

  
}
