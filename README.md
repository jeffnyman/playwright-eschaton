<h1 align="center">
  🎭 Playwright Eschaton 🎭
</h1>

<p align="center">
  <strong>The stage is set, let the automation begin.</strong>
</p>

<p align="center">
  <em>A Pedagogical Pastiche of Playwright Programming</em>
</p>

<p align="center">
  <a href="https://github.com/jeffnyman/playwright-eschaton/actions/workflows/playwright.yml"><img src="https://github.com/jeffnyman/playwright-eschaton/actions/workflows/playwright.yml/badge.svg" alt="Playwright Eschaton Test Status"></a>
  <a href="https://github.com/jeffnyman/playwright-eschaton/actions/workflows/lint.yaml"><img src="https://github.com/vitalets/playwright-bdd/actions/workflows/lint.yaml/badge.svg" alt="Playwright Eschaton Lint Status"></a>
</p>

<p align="center">
  <a href="https://github.com/jeffnyman/playwright-eschatont/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Playwright Eschaton is released under the MIT license.">
  </a>
</p>

<p align="center">
  Works on <img src="assets/win_sm.png" alt="Windows"> Windows,
  <img src="assets/apple_sm.png" alt="macOS"> macOS and
  <img src="assets/linux_sm.png" alt="Linux"> Linux.
</p>

---

<p align="center">
"Our lives now are an internship for the eschaton."<br>
Russell D. Moore, <em>Onward: Engaging the Culture without Losing the Gospel</em>
</p>

---

## 🚀 Learning

> [!TIP]
> This repo is meant to be _studied_ and played around with.

Look at how the various projects are set up; look at what happens when you execute them; look at some of the design decisions. Nothing in here is touted as the "right" way necessarily. What is here is a means to show what does work and give you a starting point for your own learning. I recommend looking at the **Execution** section below to get a feel for what's in place. You can also see **Jeff's Principles of Coding** further down for some of my overall design thinking.

If you find any of this useful, consider leaving a ⭐️ for this repo.

## 🟢 Prerequisites

Make sure you have [Node.js](https://nodejs.org/en). The LTS version should be fine. You will also need the `npm` package manager, which comes with Node.js. A development environment or IDE with TypeScript/JavaScript support will help. [Visual Studio Code](https://code.visualstudio.com/) is a good choice.

## ⚡ Quick Start

Clone the repository and then set everything up:

```shell
npm ci
```

Make sure to install the browsers that Playwright will need.

```shell
npx playwright install
```

## 💻 Execution

In Playwright, a project is a logical group of tests that run using the same configuration. The sections below will each be shown with a command that executes the specific project. For any examples that are marked as UI, you can pass the `--headed` argument in order to see the browser execution.

You can run any Playwright tests using the [VS Code extension](https://playwright.dev/docs/getting-started-vscode). This project will recommend that extension if you are using VS Code. However, it is highly recommended that you understand how to execute from the CLI.

### 🔸 Tautology Tests

These tests do not use a browser at all. They are meant to showcase the idea of simply writing tests and having some general tautologies that validate the basic operation of the testing framework.

One of the tautology tests isn't entirely frivolous since it serves as a small API test as well. My [Swagger UI](https://testerstories.com/swagger-ui) is set up with some simple OpenAPI specs, one of which is my [tautology spec](https://testerstories.com/files/api/openapi_test.yml) which is run as part of this project.

```shell
npx playwright test --project "Tautology Tests"
```

Try running just the tests marked as `@canary`. You have to do this differently based on the operating system. For any POSIX-based system:

```shell
npx playwright test --project "Tautology Tests" --grep @canary
```

For Windows, particularly in Powershell:

```shell
npx playwright test --project "Tautology Tests" --grep "@canary"
```

### 🔸 Sauce Labs Example (UI)

This is an example project that shows how [project dependencies](https://playwright.dev/docs/next/test-projects#dependencies) in Playwright work. The idea is that you can login to an application and save those logged in credentials in storage state. Tests that rely on the logged in setup can then use this storage stage when executing, which means they don't have to login again before each test.

This project also shows the use of the `.env` file to set environment variables that can be used as part of your tests. To run these tests, you'll want to create an `.env` in the project directory if you don't already have one. By design, the `.env` file is not version controlled.

```shell
cp .env.sample .env.
```

Then specify these two settings:

```ini
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```

The setup test will use these credentials to log in. You could actually run the setup test by itself since it's a distinct project. You would just do this:

```shell
npx playwright test --project "Sauce Setup"
```

This setup script will generate a file called `.auth/sauce_user.json`. However you don't actually have to do that! That setup project is a dependency of another project, one that executes tests against the Sauce Labs site. Those tests live in a project that calls the setup project as a dependency. To run the tests that depend on the setup project:

```shell
npx playwright test --project "Sauce Logged In Tests"
```

This project uses a `storageState` to indicate which storage state information should be used. That's stored in a constant called `SAUCE_STORAGE_STATE` and that constant points to the above mentioned `sauce_user.json` that was generated.

There's also a project that does _not_ use the setup project and that's because this other project does not require a login. To run that, you can do this:

```shell
npx playwright test --project "Sauce Logged Out Tests"
```

This would be a good example where you might have tests that run only when logged in and other tests that check happens when not logged in.

This small little project is actually showcasing a series of things, such as environment settings, the use of storage state and project dependencies that are conditionalized based on whether the storage state is needed.

In terms of the tests, you might also note that this project indicates a specific `testIdAttribute` that is used by the Sauce Labs demo, which is `data-test`. This is what will be looked for when calls are made to the `getByTestId()` function. You might also check out how the projects use `testMatch` and `testIgnore` settings based on the name of the spec files.

### 🔸 Ludic UI Tests

The Ludic pages are simply designed as blog content pages. Their complexity comes in from how the header and the scroll-to-top functionality have dynamic aspects, in terms of how and when they display. The dark-light mode is a relatively simply implementation that also accounts for the system setting. There are also "click to enlarge" elements on the page that provide a modal view for images.

To run these tests:

```shell
npx playwright test --project "Ludic UI Tests"
```

### 🔸 Playground UI Tests

The playground area is designed to provide a simple landing page but then add some complexity. For example, the navigation pull out menu can have some challenges around checking for visibility and whether the widgets are in the viewport or not.

To run all the tests:

```shell
npx playwright test --project "Playground UI Tests"
```

The various pages within the playground are meant to run the gamut from relatively simple implementations of forms to slightly complex tables to elements that dynamically update but only upon the detection of certain user actions.

The planet weight area has two tests: one that uses a page object and one that does not. The same applies to the landing page tests. In both of those areas, you can see examples of iterating over data conditions while providing a single test condition.

### 🔸 Todo MVC UI Tests

I have provided my own [Todo MVC](https://testerstories.com/todomvc) application. You can run the tests:

```shell
npx playwright test --project "Todo UI Tests"
```

The Page Object Model is the often recommended approach for effective code organization in tests. Yet the very naming of the model -- page object -- tends to have people modeling only a whole page. Yet, there are often sections of a page that make sense to model on their own.

Some of these might be common elements between all pages, such as any navigation, headers and footers. Others might simply be defined areas of use that make sense to model distinctly. We can call this a Component Model approach.

A component approach would provide a bit more possibility for reuse but also for composability. The basic idea would be to create an intermediate layer of components that model aspects of the application and that all tests can utilie.

In this project, the components for the Todo MVC application can be found in the `components` folder for the project. The `ts-todo-app.spec.ts` shows the tests using my TesterStories application but using the component model.

The `demo-todo-app.spec.ts` file is the same file that comes with Playwright as a working example. What I've done is show that this test, without modification, works on my slightly modified Todo MVC example. What this does is allow you to see the component approach side-by-side with the non-component approach.

### 🔸 Weather (API)

To run the tests for this you need to obtain an account and API key from Weather API. You can see the OpenAPI spec I have available for the [OpenWeatherMap API](https://testerstories.com/swagger-ui/?urls.primaryName=Weather+API), which I'm using for this example.

This project, like the Sauce Labs example, shows the use of the `.env` file to set environment variables that can be used as part of your tests. To run these tests, you'll want to create an `.env` in the project directory if you don't already have one. By design, the `.env` file is not version controlled.

```shell
cp .env.sample .env.
```

Then specify these two settings:

```ini
WEATHER_API_KEY=YOUR API KEY GOES HERE
WEATHER_API_URL=https://api.weatherapi.com/v1
```

You need to place your personal API key as the value for `WEATHER_API_KEY`. Once you have that in place, you can run the Playwright specific tests for this project:

```shell
npx playwright test --project="Weather API Tests"
```

One thing to note about these Playwright tests is how they are using the `APIRequestContext`. This is used to provide an abstraction layer for the API tests, which can be seen in `tests/api/weather/activity/invoke.ts`.

You can also run the Playwright tests via the following command:

```shell
npm run test:weather:pw
```

The reason for the alternate execution method is because part of the goal of this particular set of tests it to also show how to leverage multiple tools. For example, I have some Newman tests for this as well. These tests are based on Postman collection files. You can run these with:

```shell
npm run test:weather:postman
```

There is also a supplemental project that runs the exact same API tests as the Playwright example but using Jest alone. You can run that with:

```shell
npm run test:weather:jest
```

What all of these examples show is that you can run multiple test styles within the same project.

### 🔸 Booker API Tests

The goal of this project is to demonstrate how to create an abstraction layer on top of standard testing practices, specifically focusing on API interactions using Playwright. To run the tests:

```shell
npx playwright test --project="Booker API Tests"
```

By building the abstraction, I've effectively created a test harness that wraps Playwright's internal operations, allowing for more streamlined and reusable test code. Here the abstraction is placed in the `harness` directory of the Booker project although this would likely be put in a more central location for any API tests.

#### API Abstraction in `api.ts`

The `harness/api.ts` file encapsulates all the logic for making API requests within your tests. It defines a class named API, which acts as a dedicated client for interacting with the API. By abstracting API communication into this class, we separate concerns and provide a clean interface for the rest of the test suite.

The API class is initialized with an `APIRequestContext`, a Playwright object that manages HTTP requests. The core method, `generateRequest`, handles the complexity of sending HTTP requests. This method dynamically constructs requests based on parameters such as the HTTP method, endpoint, request body, and authentication token, and returns the resulting response. Helper methods like `getRequest`, `postRequest`, and others are built on top of generateRequest, simplifying the process of making common API calls in your tests. This setup abstracts away the underlying details of API communication, allowing tests to focus on validation logic rather than request construction.

#### Fixture Setup in `fixture.ts`

The `harness/fixture.ts` file defines a fixture that integrates the API class into the Playwright test environment. This fixture sets up the API instance and makes it available to all tests via Playwright’s dependency injection mechanism.

The fixture is built using Playwright’s extend function, which allows you to augment the base test environment with custom fixtures. In this case, the API fixture is created to inject an instance of the API class, initialized with the Playwright request context, into the test environment. This ensures that every test block has access to the same, consistent API client, facilitating more uniform and reliable tests.

Additionally, the fixture file defines TypeScript interfaces like `AuthResponse` and `BookingResponse` to describe the expected structure of API responses. These interfaces not only provide type safety but also serve as documentation, clearly defining what the tests expect from the API.

#### Test Implementation in `booker.spec.ts`

The test suite in `booker.spec.ts` showcases how to use the API abstraction and fixture to write clean, maintainable tests. The test blocks leverage the API parameter, injected by the fixture, to interact with the API. This allows the tests to focus purely on the validation of API behavior, without worrying about the intricacies of request handling.

Each test case follows a straightforward structure: making an API call using the appropriate method from the `API` class and then asserting the response using Playwright’s assertion library. Notably, the tests make use of [soft assertions](https://playwright.dev/docs/test-assertions#soft-assertions) provided by Playwright, which allow the test execution to continue even if an assertion fails. This is particularly useful in scenarios where you want to validate multiple aspects of a response without halting the test prematurely.

#### Overall Structure

By structuring the Booker API project this way, what's achieved is a clear separation of concerns: the API class handles the communication logic, the fixture integrates this logic into the test environment, and the test files focus on validation. This design promotes reusability, maintainability, and clarity in API testing.

## 📊 Reporting

This project generates all of the standard reporting possible for tests in a Playwright context. You can always view the Playwright generated report with:

```shell
npm run report:pw
```

It's also possible to write custom reporters and one is provided with this project.

### Summary Reporter

This is a custom reporter is provided that generates a very condensed view of test execution. This condensed format could be used to publish test results to something like an SMS message or a Slack channel update. The default output location is to the root project directory as a file called `summary.txt`. You can change this location in the reporter configuration, which this project does.

There is a `Stats` interface provided that the custom summary reporter uses but this can also be used by your own custom reporter, essentially based on the summary report. For an example of how to do that, you'll see a file called `concise.ts` in the `support/reporter` directory. This project uses that concise report as part of the reporter configuration.

## 🧬 Code Quality

This project uses Prettier.

<p align="center">
  <a href="https://prettier.io/docs/en/index.html"><img src="https://img.shields.io/badge/Documentation-Prettier-f7ba3e.svg?logo=prettier" alt="Prettier"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/GitHub-Prettier-f7ba3e.svg?logo=github" alt="Prettier - GitHub"></a>
  <a href="https://stackoverflow.com/questions/tagged/prettier"><img src="https://img.shields.io/badge/stackoverflow-Prettier-e87922.svg?logo=stackoverflow" alt="Prettier - Stack Overflow"></a>
</p>

This is critical for any automation-based project. To run Prettier and automatically fix any issues, you can do this:

```shell
npm run format:fix
```

This project uses ESLint.

<p align="center">
  <a href="https://eslint.org/docs/latest/"><img src="https://img.shields.io/badge/Documentation-ESLint-4b32c3.svg?logo=eslint" alt="ESLint"></a>
  <a href="https://github.com/eslint/eslint"><img src="https://img.shields.io/badge/GitHub-ESLint-4b32c3.svg?logo=github" alt="ESLint - GitHub"></a>
  <a href="https://stackoverflow.com/questions/tagged/eslint"><img src="https://img.shields.io/badge/stackoverflow-ESLint-e87922.svg?logo=stackoverflow" alt="ESLint - Stack Overflow"></a>
</p>

You can run linting in this project by doing this:

```shell
npm run lint
```

If you're feeling confident that the linter will be able to auto-fix your isue, you can run it like this:

```shell
npm run lint:fix
```

## 🌀 Pipeline

This project is using GitHub Actions. Check [playwright.yml](https://github.com/jeffnyman/playwright-eschaton/blob/main/.github/workflows/playwright.yml).

## 🐳 Docker

To run tests in Docker containers, follow these steps:

1. **Build the Docker Image**

Install Docker and then build the Docker image from the provided Dockerfile:

```shell
docker build -t <image-name> .
```

2. **Create and Launch the Container**

Create a container from the image and launch it in detached mode:

```shell
docker run -it -d <image-name>
```

3. **Verify Container is Running**

Check that the container is up and running by listing all containers:

```shell
docker ps -a
```

Copy the `container-id` of your running container.

4. **Log into the Container**

Log into the running container's shell:

```shell
docker exec -it <container-id> bash
```

5. **Run Playwright Tests**

Inside the Docker container, run your Playwright tests as usual:

```shell
npx playwright test
```

6. **Stop and Remove the Container (optional)**

After your tests are done, you can stop and remove the container to clean up:

```shell
docker stop <container-id>
docker rm <container-id>
```

### Example Commands

Build the Docker image:

```shell
docker build -t playwright-eschaton .
```

Create and run the container:

```shell
docker run -it -d playwright-eschaton
```

Log into the container:

```shell
docker exec -it <container-id> bash
```

Run tests inside the container:

```shell
npx playwright test
```

## 🔸 Test References

I'm using my own site material for this. One is a sample article called [A Ludic Historian Précis](https://testerstories.com/xyzzy/ludic/article/precis.html). The other is my [Playwright Playground](https://testerstories.com/xyzzy/).

## 👨‍💻 Jeff's Principles of Coding

- Embrace small code.
- Abstraction encourages clarity.
- No computation is too small to be put into a helper function.
- No expression is too simple to be given a name.
- Small code is more easily seen to be obviously correct.
- Code that’s more obviously correct can be more easily composed.
- Be willing to trade elegance of design for practicality of implementation.
- Embrace brevity, but do not sacrifice readability. Concise, not terse.
- Prefer elegance over efficiency where efficiency is less than critical.

## 📜 Why "Playwright Eschaton"?

As an existential note, this project is not intended to [immanentize the eschaton](https://en.wikipedia.org/wiki/Immanentize_the_eschaton). (Just in case anyone was worried.)

The _eschaton_ is from the ancient Greek term _ἔσχατον_ (_éskhaton_). The word literally refers to the 'last thing' or even 'the end.' When construed as the latter, the phrase tends to refer to the final events, or last days, of history. In theological circles it also refers to the ultimate destiny of the human race.

A fairly grandiose set of meanings, to say the least. All my current project does, however, is indicate what I believe to be the 'last thing' I intend to put up regarding my experiments with development and automation around [Playwright](https://playwright.dev).

---

<p align="center">
"I am the Eschaton. I am not your God.<br>
I am descended from you, and exist in your future.<br>
Thou shalt not violate causality within my historic light cone.<br>
Or else."<br><br>
Charles Stross, <em>Singularity Sky</em>
</p>

---

## ⚖ License

The code used in this project is licensed under the [MIT license](https://github.com/jeffnyman/playwright-eschaton/blob/main/LICENSE).
