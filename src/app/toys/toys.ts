import { Component, signal } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { RouterLink } from '@angular/router';
import { Utils } from '../utils';
import Swal from 'sweetalert2';
import { ToyRatingService } from '../../services/toy.rating.service';

@Component({
  selector: 'app-toys',
  imports: [RouterLink],
  templateUrl: './toys.html',
  styleUrl: './toys.css'
})
export class Toys {
  protected toys = signal<ToyModel[]>([])

  constructor(protected utils: Utils, private toyRatingService: ToyRatingService) {
    this.utils.showLoading()
    ToyService.getAllToys()
      .then(rsp => {
        this.toys.set(rsp.data)
        Swal.close()
      })
      .catch(err => {
        Swal.close()
        console.log(err)
      })
  }

  getToyAverageRating(toyId: number): number {
    return this.toyRatingService.getAverageRating(toyId);
  }

  getToyRatingCount(toyId: number): number {
    return this.toyRatingService.getRatingCount(toyId);
  }
  getFullStars(rating: number): number {
    return Math.floor(rating);
  }
  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }
}