import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGamePage } from './join-game.component';

describe('JoinGamePage', () => {
  let component: JoinGamePage;
  let fixture: ComponentFixture<JoinGamePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinGamePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
