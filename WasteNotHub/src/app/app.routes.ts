import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { BrowseListingsComponent } from './food/browse-listings/browse-listings.component';
import { ViewListingComponent } from './food/view-listing/view-listing.component';
import { UploadListingComponent } from './food/upload-listing/upload-listing.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'browse-listings',
    component: BrowseListingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload-listing',
    component: UploadListingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listings/:id',
    component: ViewListingComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/browse-listings', pathMatch: 'full' },
  { path: '**', redirectTo: '/browse-listings' },
];
