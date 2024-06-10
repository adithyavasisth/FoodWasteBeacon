import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FoodListing, FoodListingService } from '../food-listing.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { delay, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-view-listing',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MarkdownModule,
    MatSnackBarModule,
  ],
  providers: [provideMomentDateAdapter(MY_DATE_FORMATS)],
  templateUrl: './view-listing.component.html',
  styleUrl: './view-listing.component.scss',
})
export class ViewListingComponent implements OnInit {
  minDate: Date;
  minTime: string;
  listingForm: FormGroup;
  listing: FoodListing;
  id: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private listingService: FoodListingService
  ) {
    this.listingForm = this.fb.group({
      foodType: ['', Validators.required],
      quantity: ['', Validators.required],
      location: ['', Validators.required],
      availabilityDate: ['', Validators.required],
      availabilityTime: ['', Validators.required],
      description: [''],
      remaining: ['', Validators.required],
    });

    this.minDate = new Date();
    this.minTime = this.formatTime(this.minDate);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.listingService
      .getListing(this.id)
      .subscribe((listing: FoodListing) => {
        this.listing = listing;
        const availabilityDate = new Date(listing.availabilityTime);
        const availabilityTime = availabilityDate.toTimeString().slice(0, 5);
        this.listingForm.patchValue({
          ...listing,
          availabilityDate: availabilityDate,
          availabilityTime: availabilityTime,
        });
      });
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  sendNotification(id) {
    timer(1000)
      .pipe(switchMap(() => this.listingService.notifyUsers(id)))
      .subscribe(() =>
        this.snackBar.open('Notification Sent', 'Close', { duration: 2000 })
      );
  }

  onSubmit(): void {
    if (this.listingForm.valid) {
      const formValue = this.listingForm.value;
      const availabilityDate = new Date(formValue.availabilityDate);
      availabilityDate.setHours(
        parseInt(formValue.availabilityTime.split(':')[0], 10),
        parseInt(formValue.availabilityTime.split(':')[1], 10)
      );
      const availabilityTimeISO = availabilityDate.toISOString();

      const updatedListing = {
        ...this.listing,
        ...formValue,
        availabilityTime: availabilityTimeISO,
      };
      delete updatedListing.availabilityDate;

      this.listingService
        .updateListing(this.id, updatedListing)
        .subscribe(() => {
          this.router.navigate(['/listings']);
        });
    }
  }
}
