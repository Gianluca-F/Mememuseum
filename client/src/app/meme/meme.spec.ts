import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeComponent } from './meme';

describe('MemeComponent', () => {
  let component: MemeComponent;
  let fixture: ComponentFixture<MemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
