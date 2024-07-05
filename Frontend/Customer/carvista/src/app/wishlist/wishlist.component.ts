import { ChangeDetectionStrategy, Component , inject ,OnInit, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ViewDialogComponent} from './view-dialog/view-dialog.component'


export let wishesToView:Wishes;

export interface Wishes {
  id: number;
  carid: number;
  customerid: number;
  model: string;
  manufacturer: string;
  description : string;
  image : string;
    isStarred? : boolean;
}



@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [HttpClientModule,MatButtonModule,MatDialogModule,CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WishlistComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  httpClient = inject(HttpClient);
  public wishes = signal<Wishes[]>([]);
  private customerId: number = 4; // This will be Fixed untill the login is completed
  constructor(){
    this.getAllWishes();
  }

  openDialog(wish:Wishes) {
    wishesToView = wish;
    const dialogRef = this.dialog.open(ViewDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  getAllWishes(){
    var userId = localStorage.getItem("id");
    this.httpClient.get<Wishes[]>('http://localhost:5210/api/Wishlist/'+userId)
    .subscribe({
      next: (data: Wishes[]) => {
        this.wishes.set(data);
      },
      error: (err) => console.error(err)
    });
  }





  ngOnInit() {
    this.getAllWishes();
  }


  toggleStar(wish: Wishes) {
    wish.isStarred = !wish.isStarred;
    if (wish.isStarred)
      {
        this.RemoveCarFromWhishlistDB(wish.id);
      }
}

  RemoveCarFromWhishlistDB(whishListId?:number) {
    this.httpClient.delete(`http://localhost:5210/api/Wishlist/${whishListId}`)
      .subscribe({
        next: () => {
          this.getAllWishes()
        },
        error: (err) => console.error('Error adding car to wishlist', err)
      });
  }
}
