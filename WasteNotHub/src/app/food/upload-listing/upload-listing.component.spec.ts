import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadListingComponent } from './upload-listing.component';

describe('UploadListingComponent', () => {
  let component: UploadListingComponent;
  let fixture: ComponentFixture<UploadListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
