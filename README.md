# ECommerceUI

# Shoe Store Frontend

Welcome to the **Shoe Store** frontend repository! This project is built using **Angular 18** and serves as the user interface for an e-commerce platform dedicated to selling shoes. The backend for this project is developed using **ASP.NET Core**, which handles business logic and data management.

## Features

- Browse a variety of shoes with filtering and sorting options.
- View detailed product pages with available sizes and stock information.
- Add items to the cart and proceed to checkout.
- User authentication and order management.
- Responsive design for a seamless experience on different devices.

## Tech Stack

- **Frontend:** Angular 19, TypeScript, HTML, SCSS
- **Backend:** [ASP.NET Core Backend Repository](https://github.com/modernc1/Shoes-Store.API)
- **State Management:** NgRx (if applicable)
- **UI Framework:** Angular Material / Bootstrap (if used)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Angular CLI](https://angular.io/cli)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/shoe-store-frontend.git
   cd shoe-store-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure the environment variables (if applicable).

### Running the Application

To start the development server, run:
```sh
ng serve
```
Then, navigate to `http://localhost:4200/` in your browser.

## API Integration

This frontend application communicates with the backend through a REST API. Ensure the backend is running before testing full functionality.

Backend Repository: [Shoe Store Backend](https://github.com/modernc1/Shoes-Store.API)

## Deployment

To build the project for production:
```sh
ng build --configuration=production
```
This will generate the optimized files in the `dist/` folder.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

Feel free to update the links, dependencies, or any specific configurations based on your project setup.


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
