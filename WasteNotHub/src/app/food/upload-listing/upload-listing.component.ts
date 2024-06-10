import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FoodListing, FoodListingService } from '../food-listing.service';
import { CommonModule } from '@angular/common';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { delay, switchMap } from 'rxjs';

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
  selector: 'app-upload-listing',
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
    RouterModule,
    MatSnackBarModule,
    CommonModule,
    FormsModule,
  ],
  providers: [provideMomentDateAdapter(MY_DATE_FORMATS)],
  templateUrl: './upload-listing.component.html',
  styleUrl: './upload-listing.component.scss',
})
export class UploadListingComponent {
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
    this.minDate = new Date();
    this.minTime = this.formatTime(this.minDate);

    this.listingForm = this.fb.group({
      foodType: ['', Validators.required],
      quantity: ['', Validators.required],
      location: ['', Validators.required],
      availabilityDate: [this.minDate, Validators.required],
      availabilityTime: ['', Validators.required],
      description: [''],
    });
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
        .createListing(updatedListing)
        .pipe(
          delay(1000),
          switchMap((listing) => this.listingService.notifyUsers(listing._id))
        )
        .subscribe(() => {
          this.snackBar.open('Listing created successfully', 'Close', {
            duration: 2000,
          });
          this.router.navigate(['/food']);
        });
    }
  }
}
