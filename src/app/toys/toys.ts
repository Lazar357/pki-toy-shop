import { Component, signal, computed } from '@angular/core';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../../services/toy.service';
import { Router, RouterLink } from '@angular/router';
import { Utils } from '../utils';
import Swal from 'sweetalert2';
import { ToyRatingService } from '../../services/toy.rating.service';
import { FormsModule } from '@angular/forms';


interface BasketItem {
  toy: ToyModel;
  quantity: number;
}

interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  ageGroup: string;
  targetGroup: string;
}

@Component({
  selector: 'app-toys',
  imports: [RouterLink, FormsModule],
  templateUrl: './toys.html',
  styleUrl: './toys.css'
})
export class Toys {
  protected allToys = signal<ToyModel[]>([]);
  protected basket = signal<BasketItem[]>([]);

  protected filters = signal<FilterState>({
    category: '',
    minPrice: 0,
    maxPrice: 100000,
    ageGroup: '',
    targetGroup: ''
  });

  protected categories = signal<{ typeId: number; name: string; description: string; }[]>([]);
  protected ageGroups = signal<string[]>(['0-2', '3-5', '6-9', '10+']);
  protected targetGroups = signal<string[]>(['dečak', 'devojčica']);

  protected toys = computed(() => {
    const allToys = this.allToys();
    const filterState = this.filters();

    return allToys.filter(toy => {
      if (filterState.category && toy.type?.typeId !== +filterState.category) {
        return false;
      }

      if (toy.price < filterState.minPrice || toy.price > filterState.maxPrice) {
        return false;
      }

      if (filterState.ageGroup && toy.ageGroup.name !== filterState.ageGroup) {
        return false;
      }

      if (filterState.targetGroup && toy.targetGroup !== filterState.targetGroup) {
        return false;
      }

      return true;
    });
  });

  protected basketTotal = computed(() => {
    return this.basket().reduce((sum, item) => sum + (item.toy.price * item.quantity), 0);
  });

  protected basketItemCount = computed(() => {
    return this.basket().reduce((sum, item) => sum + item.quantity, 0);
  });

  constructor(protected utils: Utils, private toyRatingService: ToyRatingService, private router: Router) {
    this.utils.showLoading();
    ToyService.getAllToys()
      .then(rsp => {
        this.allToys.set(rsp.data);
        this.extractCategories(rsp.data);
        Swal.close();
      })
      .catch(err => {
        Swal.close();
        console.log(err);
      });
  }

  private extractCategories(toys: ToyModel[]) {
    const uniqueCategories = toys
      .map(toy => toy.type)
      .filter((type, index, self) =>
        type && self.findIndex(t => t?.typeId === type?.typeId) === index
      );
    this.categories.set(uniqueCategories);
  }

  addToBasket(toy: ToyModel) {
    const currentBasket = this.basket();
    const existingItem = currentBasket.find(item => item.toy.toyId === toy.toyId);

    if (existingItem) {
      this.basket.set(
        currentBasket.map(item =>
          item.toy.toyId === toy.toyId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.basket.set([...currentBasket, { toy, quantity: 1 }]);
    }

    Swal.fire({
      title: 'Dodato!',
      text: `${toy.name} je dodato u korpu`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }

  removeFromBasket(toyId: number) {
    this.basket.set(this.basket().filter(item => item.toy.toyId !== toyId));
  }

  updateQuantity(toyId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromBasket(toyId);
      return;
    }

    this.basket.set(
      this.basket().map(item =>
        item.toy.toyId === toyId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearBasket() {
    Swal.fire({
      title: 'Da li ste sigurni?',
      text: 'Obrisaćete sve proizvode iz korpe',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Da, obriši',
      cancelButtonText: 'Otkaži'
    }).then(result => {
      if (result.isConfirmed) {
        this.basket.set([]);
        Swal.fire('Obrisano!', 'Korpa je ispražnjena', 'success');
      }
    });
  }

  updateFilter(key: keyof FilterState, value: any) {
    this.filters.set({ ...this.filters(), [key]: value });
  }

  resetFilters() {
    this.filters.set({
      category: '',
      minPrice: 0,
      maxPrice: 100000,
      ageGroup: '',
      targetGroup: ''
    });
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

  hasAuth() {
    if (localStorage.getItem('active'))
      return true
    return false
  }

  pay() {
    if (!this.hasAuth()) {
      Swal.fire({
        title: 'Prijavite se na nalog',
        text: 'Da bi ste mogli da platite!',
        icon: 'warning'
      })
      this.router.navigateByUrl('/login')
    } else {
      Swal.fire({
        title: 'Da li ste sigurni da zelite da platite?',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'Otkazi',
        confirmButtonText: 'Potvrdi'
      }).then(result => {
        if (result.isConfirmed) {
          this.basket.set([])
          Swal.fire({
            title: 'Uspesno placeno!',
            text: 'Uskoro cete primiti potvrdni mejl.',
            icon: 'success'
          })
        }

      })
    }
  }
}