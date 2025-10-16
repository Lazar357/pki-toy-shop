import { Component, signal, OnInit } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ActivatedRoute } from '@angular/router';
import { ToyService } from '../../services/toy.service';
import { Utils } from '../utils';
import Swal from 'sweetalert2';
import { ToyRatingService } from '../../services/toy.rating.service';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class Details implements OnInit {
  protected toy = signal<ToyModel | null>(null)
  protected other = signal<ToyModel[]>([])
  currentRating = 0
  hoverRating = 0

  constructor(
    private route: ActivatedRoute,
    protected utils: Utils,
    private toyRatingService: ToyRatingService,
    private basketService: BasketService
  ) {
    this.utils.showLoading()
    this.route.params.subscribe((params: any) => {
      ToyService.getToyById(params.toyId)
        .then(rsp => {
          console.log(rsp.data)
          this.toy.set(rsp.data)
          this.currentRating = this.toyRatingService.getUserLastRating(rsp.data.toyId);

          ToyService.getToyByPermalink(rsp.data.permalink)
            .then(rsp => {
              this.other.set(rsp.data.content)
              Swal.close()
            })
        })
    })
  }

  ngOnInit(): void {

  }


  onStarClick(rating: number): void {
    this.currentRating = rating;
    if (this.toy()) {
      this.toyRatingService.addRating(this.toy()!.toyId, rating);
      Swal.fire({
        icon: 'success',
        title: 'Hvala na oceni!',
        text: (() => {
          switch (rating) {
            case 1: return "Hvala Vam na jednoj zvezdi! Nastojimo da budemo bolji.";
            case 2: return "Hvala Vam na dve zvezde! Radimo na poboljsanjima.";
            case 3: return "Hvala Vam na tri zvezde! Cenimo Vasu povratnu informaciju.";
            case 4: return "Hvala Vam na cetiri zvezde! Drago nam je što Vam se dopada.";
            case 5: return "Hvala Vam na pet zvezdi! Odusevljeni smo što ste zadovoljni!";
            default: return `Hvala Vam na iskrenoj oceni`;
          }
        })(),
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  onStarHover(rating: number): void {
    this.hoverRating = rating;
  }

  onStarLeave(): void {
    this.hoverRating = 0
  }

  getRatingText(): string {
    const texts: { [key: number]: string } = {
      1: 'Loše (1/5)',
      2: 'Može bolje (2/5)',
      3: 'Dobro (3/5)',
      4: 'Vrlo dobro (4/5)',
      5: 'Odlično (5/5)'
    };
    return texts[this.currentRating] || 'Izaberite ocenu';
  }

  isStarActive(starRating: number): boolean {
    if (this.hoverRating > 0) {
      return starRating <= this.hoverRating;
    }
    return starRating <= this.currentRating;
  }

  getAverageRating(): number {
    return this.toy() ? this.toyRatingService.getAverageRating(this.toy()!.toyId) : 0;
  }

  getRatingCount(): number {
    return this.toy() ? this.toyRatingService.getRatingCount(this.toy()!.toyId) : 0;
  }

  addToBasket(toy: ToyModel){
    this.basketService.addToBasket(toy)
  }
}