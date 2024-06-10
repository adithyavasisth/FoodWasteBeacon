import { Component, OnInit, ViewChild } from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { FoodListing, FoodListingService } from '../food-listing.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-browse-listings',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [provideMomentDateAdapter(MY_DATE_FORMATS)],
  templateUrl: './browse-listings.component.html',
  styleUrl: './browse-listings.component.scss',
})
export class BrowseListingsComponent implements OnInit {
  displayedColumns: string[] = [
    'foodType',
    'quantity',
    'location',
    'availabilityTime',
    'description',
    'remaining',
    'actions',
  ];
  listings: FoodListing[] = [];
  filteredListings: MatTableDataSource<FoodListing>;
  filterText: string = '';
  selectedDate: Date | null = null;
  selectedTime: string = '';

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private listingService: FoodListingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.selectedDate = now;
    this.selectedTime = now.toTimeString().slice(0, 5);
    this.loadListings();
  }

  loadListings() {
    this.listingService.getListings().subscribe({
      next: (listings) => {
        this.listings = listings;
        console.log(this.listings);
        this.filteredListings = new MatTableDataSource(this.listings);
        this.filteredListings.sort = this.sort;
      },
      error: (error) => {
        console.error('Error loading listings:', error);
      },
    });
  }

  applyFilter(column: string, event: Event | any) {
    let value = (event.target as HTMLInputElement).value;
    value = value.trim().toLowerCase();

    this.filteredListings.filterPredicate = (
      listing: FoodListing,
      filter: string
    ) => {
      switch (column) {
        case 'foodType':
          return listing.foodType.toLowerCase().includes(filter);
        case 'location':
          return listing.location.toLowerCase().includes(filter);
        default:
          return false;
      }
    };

    this.filteredListings.filter = value;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = new Date(event.value);
    this.applyDateTimeFilter();
  }

  onTimeChange(event: Event) {
    this.selectedTime = (event.target as HTMLInputElement).value;
    this.applyDateTimeFilter();
  }

  applyDateTimeFilter() {
    console.log(this.selectedDate, this.selectedTime);
    if (this.selectedDate && this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      this.selectedDate.setHours(hours, minutes);
      const filterDate = this.selectedDate.toISOString();

      this.filteredListings.filterPredicate = (
        listing: FoodListing,
        filter: string
      ): boolean => {
        const listingDate = new Date(listing.availabilityTime);
        return listingDate.getTime() >= new Date(filter).getTime();
      };

      this.filteredListings.filter = filterDate;
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  viewListing(id: string) {
    // route it to router link listings/:id
    console.log('Viewing listing with id:', id);
    this.router.navigate(['/listings', id]);
  }

  deleteListing(id: string) {
    // Implement the logic to delete the listing
    this.listingService.deleteListing(id).subscribe(
      (response) => {
        this.snackBar.open('Listing Deleted', 'Close', { duration: 2000 });
        this.loadListings();
      },
      (error) => {
        console.error('Error deleting listing:', error);
      }
    );
  }
}
