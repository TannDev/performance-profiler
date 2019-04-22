# Performance Profiler
Stayed tuned for speed!

## Usage
```javascript
const Profiler = require('./Profiler');

// Get a new task object and give it a friendly name.
let myTask = new Profiler("Stuff that happens");

// Start the clock on your task whenever you're ready.
myTask.start();
/* 
 * DO YOUR THING
 * The code you're trying to profile goes here.
 * It can be synchronous or asynchronous, doesn't matter.
 * Just make sure that you keep track of that `myTask` object.
 */

// You can check to see how long it's been since the task started.
if (myTask.seconds > 10) console.log('This is taking a while, huh?');

// Stop the clock on the task when you're done.
myTask.finish();

// At any time, you can get a collated report of all your tasks.
console.log(Profiler.csv());
```

For more details, see the [API documentation](#api-documentation).

## Development
See our [contributing guidelines](CONTRIBUTING.md) before you get started.

### Running Tests
You can run the full suite of tests with `npm test`.

To run only the basic tests, and skip the longer ones, you can use `npm test -- --quickly` instead. (Please be aware that _all_ tests must pass before a pull request will be accepted.)

### CI/CD
The build pipeline will automatically test all branches and PRs.

When a branch or commit is merged into the `master` branch, the pipeline will test it again. Assuming all tests pass, semantic-release will determine an appropriate version number and publish it if required.

**Remember:** Because version numbers are automatically determined by semantic-release, it's important that you use the appropriate commit format. If you fail to do this, then your commits will need to be squashed into a new one before your PR can be merged.

# API Documentation
(_The following documentation is generated automatically._)
<!-- DO NOT MANUALLY EDIT THIS SECTION! It is kept up to date automatically. -->
<!-- START JSDOCS -->
<!-- END JSDOCS -->
