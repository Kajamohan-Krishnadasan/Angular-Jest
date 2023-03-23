import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

class Page {
  get submitButton() {
    return this.fixture.nativeElement.querySelector('button');
  }

  get usernameInput() {
    return this.fixture.debugElement.nativeElement.querySelector('#username');
  }

  get passwordInput() {
    return this.fixture.debugElement.nativeElement.querySelector('#pwd');
  }

  get errorMsg() {
    return this.fixture.debugElement.query(By.css('.error')).nativeElement;
  }

  constructor(private fixture: ComponentFixture<LoginComponent>) {}

  public updateValue(input: HTMLInputElement, value: string) {
    input.value = value;

    input.dispatchEvent(new Event('input'));
  }
}

describe('Login Component', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;

  let loginService: LoginService;

  /**
   * in login.component.ts we
   * have this.loginService.login();
   */
  // let loginServiceSpy: { login: jest.Mock }; // Jasmine
  let loginServiceSpy: { login: jest.Mock }; // Jest

  // in login.component.ts we have this.router.navigateByUrl('/home');
  // let routerSpy: { navigateByUrl: jest.Mock }; // Jasmine
  let routerSpy: { navigateByUrl: jest.Mock }; // Jest

  let router: Router;
  let page: Page;

  beforeEach(() => {
    // loginServiceSpy = jasmine.createSpyObj(LoginService, ['login']); // Jasmine
    loginServiceSpy = { login: jest.fn() }; // Jest

    // routerSpy = jasmine.createSpyObj(Router, ['navigateByUrl']);  // Jasmine
    routerSpy = { navigateByUrl: jest.fn() }; // Jest

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: LoginService,
          useValue: loginServiceSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;

    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    page = new Page(fixture);

    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(loginComponent).toBeDefined();
  });

  xit('empty username', () => {
    expect(loginComponent.username).toBe('');

    page.submitButton.click();
    fixture.detectChanges();
    expect(loginComponent.errorMessage).toBe('Please fill all fields');
    expect(page.errorMsg.textContent).toBe(loginComponent.errorMessage);
  });

  xit('empty password', () => {
    page.updateValue(page.usernameInput, 'admin');

    expect(loginComponent.username).toBe('admin');
    expect(loginComponent.password).toBe('');

    page.submitButton.click();
    fixture.detectChanges();

    expect(loginComponent.errorMessage).toBe('Please fill all fields');
    expect(page.errorMsg.textContent).toBe(loginComponent.errorMessage);
  });

  xit('valid username and password', waitForAsync(() => {
    page.updateValue(page.usernameInput, 'admin');
    page.updateValue(page.passwordInput, 'admin');

    // here we are returning true from login service
    // (loginService.login as jest.Mock).and.returnValue(Promise.resolve(true)); // Jasmine
    (loginService.login as jest.Mock).mockResolvedValue(Promise.resolve(true)); // Jest

    page.submitButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const errorArea = debugElement.query(By.css('.error'));
      expect(errorArea).toBeNull();

      // const navArgs = (routerSpy.navigateByUrl as jest.Mock).calls.first().args[0]; // Jasmine
      const navArgs = (routerSpy.navigateByUrl as jest.Mock).mock.calls[0][0]; // Jest

      expect(navArgs).toBe('/home');
    });
  }));

  xit('Invalid credentials', fakeAsync(() => {
    page.updateValue(page.usernameInput, 'admin');
    page.updateValue(page.passwordInput, 'sfgfg');

    // here we are returning false from login service
    (loginService.login as jest.Mock).mockResolvedValue(Promise.resolve(false));

    page.submitButton.click();

    tick(); // wait for async call to complete
    fixture.detectChanges();

    expect(loginComponent.errorMessage).toBe('Invalid username or password');
    expect(page.errorMsg.textContent).toBe(loginComponent.errorMessage);
  }));

  it('Login Error', fakeAsync(() => {
    page.updateValue(page.usernameInput, 'admin');
    page.updateValue(page.passwordInput, 'admin');

    // (loginService.login as jasmine.Spy).and.rejectWith( throwError('Login failed') ); // Jasmine

    // (loginService.login as jest.Mock).mockImplementation(() => {
    //   throw new Error('Login failed');
    // });

    (loginService.login as jest.Mock).mockRejectedValue(new Error('Login failed')); // Jest

    page.submitButton.click();
    tick();

    fixture.detectChanges();
    // snapshot testing
    expect(fixture.nativeElement).toMatchSnapshot();

    expect(loginComponent.errorMessage).toBe('Login failed');
    expect(page.errorMsg.textContent).toBe(loginComponent.errorMessage);
  }));
});
