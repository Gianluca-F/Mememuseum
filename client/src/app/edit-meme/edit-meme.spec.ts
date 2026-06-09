import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemeComponent } from './edit-meme';

describe('EditMemeComponent', () => {
  let component: EditMemeComponent;
  let fixture: ComponentFixture<EditMemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
