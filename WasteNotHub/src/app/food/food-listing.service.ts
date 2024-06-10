import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface FoodListing {
  _id: string;
  foodType: string;
  quantity: string;
  location: string;
  availabilityTime: string;
  notifierID: string;
  description: string;
  remaining: string;
  message: string;
  interestedUsers: string[];
}

@Injectable({
  providedIn: 'root',
})
export class FoodListingService {
  private apiUrl: string = 'http://localhost:3000/listing';

  constructor(private http: HttpClient) {}

  getListings() {
    const url = `${this.apiUrl}/all`;
    return this.http.get<FoodListing[]>(url);
  }

  getListing(id: string) {
    const url = `${this.apiUrl}/find/${id}`;
    return this.http.get<FoodListing>(url);
  }

  createListing(listing: FoodListing) {
    const url = `${this.apiUrl}/create`;
    return this.http.post<FoodListing>(url, listing);
  }

  updateListing(id: string, listing: FoodListing) {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<FoodListing>(url, listing);
  }

  deleteListing(id: string) {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete(url);
  }
}
