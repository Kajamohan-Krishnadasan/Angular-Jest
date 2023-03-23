# Angular Jest

## Default Angular CLI README.md

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Jest

### install all dependencies for jest

- **npm i -D jest @types/jest jest-preset-angular**
- remove karma and jasmine from package.json
- remove karma.conf.js
- remove "test" script from angular.json

### add test watch

- add script in package.json
  **"test:watch": "jest -c jest.config.js src --watch"**

### add jest.config.js

- **npx jest --init**

  - add test script to package.json : yes
  - use typescript for configuration file : no
  - test environment : jsdom (browser-like)
  - add coverage : yes
  - instrumentation : v8
  - mock calls : no

- modify angular.json
  **"test" : "jset -c jest.config.js src"**
- modify tsconfig.spec.json
  **"types" :["jest"]**

  - remove "src/test.ts" from "files" array

- add and modify in jest.config.js
  - add **"preset" : "jest-preset-angular"**
  - enable **coverageReporters**
  - enable and add **"setupFilesAfterEnv" : ["<rootDir>/setup-jest.ts"]**
  - add **require("jest-preset-angular");**
  - create setup-jest.ts in root folder
  - add **import 'jest-preset-angular/setup-jest';** in setup-jest.ts
- add "postinstall" script in package.json
  **"postinstall" : "ngcc"**

### covert jasmine to jest

- some changes in home.service.spec.ts

  - jasmine.Spy => **jest.Mock**
  - jasmine.createSpy => **jest.fn**
  - .and.returnValue => **.mockReturnValue**

- no changes in home.component.spec.ts

- some changes in login.component.spec.ts

  - jasmine.Spy => **jest.Mock**
  - jasmine.createSpy => **jest.fn**
  - .and.returnValue => **.mockReturnValue**
  - .call.first().args[0] => **.mock.calls[0][0]**
  - .and.rejectWith(throwError('Login failed')) => **.mockImplementation(() => { throw new Error('Login failed');})**

- some changes in login.service.spec.ts

  - remove error status, message from expect
    .toEqual(500, 'status') => **.toEqual(500)**
    .toEqual(errMsg, 'message'); => **.toEqual(errMsg);**

- no changes in capitalize.pipe.spec.ts

- some changes in highlight.directive.spec.ts

  - .toBe('cyan','initial backgroundColor') => **.toBe('cyan')**
  - .toBe('green','changed backgroundColor') => **.toBe('green')**

- enable "esModuleInterop" in the tsconfig.spec.json and tsconfig.json
  - **"esModuleInterop" : true**

### shorthand for jest

- in login.service.spec.ts

  - loginService.login(inputData).then((data) => { expect(data).toEqual(testData); }); => **expect(loginService.login(inputData)).resolves.toEqual(testData);**

  - handling failure
    loginService.login(inputData).then(() => fail('should have failed with the 500 error'),(error: HttpErrorResponse) => {expect(error.status).toEqual(500); expect(error.error).toEqual(errMsg); });
    => **expect(loginService.login(inputData)).rejects.toMatchObject({status: 500, error: errMsg,});**

### snapshot testing

- **expect(fixture.nativeElement).toMatchSnapshot();**
- this will create a snapshot file in the same folder
- if we change the html, the test will fail because it check previous snapshot

### debug unit test using chrome

- **node --inspect-brk node_modules/jest/bin/jest.js --runInBand --watch src**


### debug in vscode

- add launch.json in .vscode folder
- 
