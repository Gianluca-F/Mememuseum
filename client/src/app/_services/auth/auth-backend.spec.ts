import { TestBed } from '@angular/core/testing';

import { AuthBackend } from './auth-backend';

describe('AuthBackend', () => {
  let service: AuthBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
