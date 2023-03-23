import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { defer } from 'rxjs';
import { HomeService } from './home.service';

describe('Home Service', () => {
  let homeService: HomeService;

  // Jasmie
  // let httpClientSpy: { get: jasmine.Spy };
  // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']); // in jasmine

  // Jest
  let httpClientSpy: { get: jest.Mock };
  httpClientSpy = { get: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeService,
        {
          provide: HttpClient,
          useValue: httpClientSpy,
        },
      ],
    });

    homeService = TestBed.inject(HomeService);
  });

  it('is created', () => {
    expect(homeService).toBeDefined();
  });

  // test the getCities method
  it('call getCities()', fakeAsync(() => {
    const testData = [
      {
        name: 'italian',
        image: 'aaron-burden-3UoB1ftLJjk-unsplash.jpg',
        alt: 'Italian Trulli',
      },
      {
        name: 'sri lanka',
        image: '4k-ultra-hd-motivational-focus-bs4nnk5bt18sgwi4.jpg',
        alt: 'Sri lanka',
      },
    ];

    // Jasmine
    // httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(testData)));

    // Jest
    httpClientSpy.get.mockReturnValue(defer(() => Promise.resolve(testData)));

    homeService.getCities().then((data) => {
      expect(data).toEqual(testData);
    });

    tick();
  }));
});
