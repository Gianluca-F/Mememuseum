import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meme } from './meme';

describe('Meme', () => {
  let component: Meme;
  let fixture: ComponentFixture<Meme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Meme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Meme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
