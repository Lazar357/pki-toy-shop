import { Injectable, signal, computed, effect } from "@angular/core";
import Swal from "sweetalert2";
import { ToyModel } from "../models/toy.model";
import { BasketModel } from "../models/basket.model";
import { Utils } from "../app/utils";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class BasketService {
    private basket = signal<BasketModel[]>([]);
    _basket = this.basket.asReadonly();

    basketTotal = computed(() =>
        this.basket().reduce((sum, item) => sum + (item.toy.price * item.quantity), 0)
    );

    basketItemCount = computed(() =>
        this.basket().reduce((sum, item) => sum + item.quantity, 0)
    );

    constructor(private utils: Utils, private router: Router) {

        const saved = localStorage.getItem('basket');
        if (saved) {
            this.basket.set(JSON.parse(saved));
        }
        effect(() => {
            localStorage.setItem('basket', JSON.stringify(this.basket()));
        });
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
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Moja korpa',
            confirmButtonColor: '#007bff',
            cancelButtonText: 'Nastavi sa kupovinom',
            cancelButtonColor: '#28a745'
        }).then(result =>{
            if(result.isConfirmed){
                this.router.navigateByUrl('/basket')
            }else{
                this.router.navigateByUrl('/toys')
            }
        })
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
                item.toy.toyId === toyId ? { ...item, quantity } : item
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
                Swal.fire('Obrisano!', 'Korpa je ispražnjena.', 'success');
            }
        });
    }

    pay() {
        if (!this.utils.hasAuth()) {
            Swal.fire({
                title: 'Prijavite se na nalog',
                text: 'Da bi ste mogli da rezervisete igracku!',
                icon: 'warning'
            });
            this.router.navigateByUrl('/login');
            return;
        }

        Swal.fire({
            title: 'Da li ste sigurni da želite da rezervisete?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Potvrdi',
            cancelButtonText: 'Otkaži'
        }).then(result => {
            if (result.isConfirmed) {
                this.basket.set([]);
                Swal.fire({
                    title: 'Uspešno rezervisano!',
                    text: 'Uskoro ćete primiti potvrdni mejl.',
                    icon: 'success'
                });
            }
        });
    }

    
}
