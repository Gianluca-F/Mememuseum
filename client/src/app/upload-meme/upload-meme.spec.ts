import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMemeComponent } from './upload-meme';

describe('UploadMemeComponent', () => {
  let component: UploadMemeComponent;
  let fixture: ComponentFixture<UploadMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadMemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
