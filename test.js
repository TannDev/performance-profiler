const {expect} = require('chai');
const Profiler = require('./Profiler');

describe('Profiler', function () {
    beforeEach('Reset the profiler', Profiler.reset);

    describe('class', function () {
        describe('csv() static method', function () {

            function generateRandomTasks(quantity = 10, minTime = 1, maxTime = 1500) {
                let tasks = [...Array(quantity)].map((_, index) => new Profiler(`Task ${index + 1}`));
                let promises = tasks.map(task => {
                    // Start the task.
                    task.start();

                    // Generate a random time to wait.
                    let time = Math.floor(Math.random() * (maxTime - minTime)) + minTime;

                    // Wait the specified time then finish the task.
                    return wait(time).then(() => task.finish());
                });
                return Promise.all(promises);
            }

            function validateReport(csv, tasks, scale) {
                // Validate that the report has that many rows, plus one for the header.
                expect(csv).to.be.a('string');
                let rows = csv.split('\n');

                // Make sure the header row matches.
                expect(rows[0]).to.equal(`"name","state","${scale}"`);

                // Make sure each entry is correct.
                for (let i = 0; i < tasks.length; i++) {
                    let row = rows[i + 1];
                    let task = tasks[i];
                    expect(row).to.equal(`"${task.name}","${task.state}",${task[scale]}`);
                }
            }

            it('should be a function', function () {
                expect(Profiler).to.have.property('csv').which.is.a('function');
            });

            it('should generate a row for each task', function () {
                return generateRandomTasks().then(tasks => {
                    // Get the CSV report.
                    let csv = Profiler.csv();

                    // Validate that the report has that many rows, plus one for the header.
                    expect(csv).to.be.a('string');
                    let rows = csv.split('\n');
                    expect(rows.length).to.equal(tasks.length + 1);
                });
            });

            it('should generate valid entries in nanosecond scale', function () {
                const scale = 'nanoseconds';
                return generateRandomTasks().then(tasks => {
                    let csv = Profiler.csv(scale);
                    validateReport(csv, tasks, scale);
                });
            });

            it('should generate valid entries in millisecond scale', function () {
                const scale = 'milliseconds';
                return generateRandomTasks().then(tasks => {
                    let csv = Profiler.csv(scale);
                    validateReport(csv, tasks, scale);
                });
            });

            it('should generate valid entries in second scale', function () {
                const scale = 'seconds';
                return generateRandomTasks().then(tasks => {
                    let csv = Profiler.csv(scale);
                    validateReport(csv, tasks, scale);
                });
            });
        });

        describe('reset() static method', function () {
            it('should be a function', function () {
                expect(Profiler).to.have.property('reset').which.is.a('function');
            });

            it('should stop tracking all existing tasks', function () {
                // Create the initial tasks.
                let originalTasks = [
                    new Profiler(generateTaskName(this, 'Original 1')),
                    new Profiler(generateTaskName(this, 'Original 2')),
                    new Profiler(generateTaskName(this, 'Original 3'))
                ];
                expect(Profiler.tasks).to.have.members(originalTasks);

                // Reset the profiler.
                Profiler.reset();
                expect(Profiler.tasks).to.be.empty;
            });

            it('should not prevent new tasks from being tracked', function () {
                // Create the initial tasks.
                let originalTask = new Profiler(generateTaskName(this, 'Original'));
                expect(Profiler.tasks).to.have.members([originalTask]);

                // Reset the profiler.
                Profiler.reset();
                expect(Profiler.tasks).to.be.empty;

                // Create new tasks.
                let newTask = new Profiler(generateTaskName(this, 'New'));
                expect(Profiler.tasks).to.have.members([newTask]);
            });
        });
    });

    describe('instances', function () {
        describe('constructor', function () {
            it('should return a task instance', function () {
                let task = new Profiler(generateTaskName(this));
                expect(task).to.be.instanceOf(Profiler);
            });

            it('should automatically add tasks to global tracking', function () {
                let task = new Profiler(generateTaskName(this));
                expect(Profiler.tasks).to.include(task);
            });

            it('should put the task in the `Pending` state', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler).to.have.property('state', 'Pending');
            });

            it('should not start timing tasks', function () {
                let profiler = new Profiler(generateTaskName(this));
                wait().then(() => expectTimesToMatch(profiler, [0, 0]));
            });
        });

        describe('start() method', function () {
            it('should be a function', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler).to.have.property('start').which.is.a('function');
            });

            it('should return the same instance', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler.start()).to.equal(profiler);
            });

            it('should put the task in the `Started` state', function () {
                let profiler = new Profiler(generateTaskName(this));
                profiler.start();
                expect(profiler).to.have.property('state', 'Started');
            });

            it('should fail on already-started tasks', function () {
                let profiler = new Profiler(generateTaskName(this));

                // Should throw on started tasks.
                profiler.start();
                expect(profiler.state).to.equal('Started');
                expect(profiler.start).to.throw();

                // Should throw on finished tasks.
                profiler.finish();
                expect(profiler.state).to.equal('Finished');
                expect(profiler.start).to.throw();
            });

            // TODO Verify that the clock starts.
        });

        describe('finish() method', function () {
            it('should be a function', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler).to.have.property('finish').which.is.a('function');
            });

            it('should return the same instance', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler.start()).to.equal(profiler);
            });

            it('should put the task in the `Finished` state', function () {
                let profiler = new Profiler(generateTaskName(this));
                profiler.start();
                profiler.finish();
                expect(profiler).to.have.property('state', 'Finished');
            });

            it('should fail on non-started or already-finished tasks', function () {
                let profiler = new Profiler(generateTaskName(this));

                // Should throw on pending tasks.
                expect(profiler.state).to.equal('Pending');
                expect(profiler.finish).to.throw();

                // Should throw on finished tasks.
                profiler.start();
                profiler.finish();
                expect(profiler.state).to.equal('Finished');
                expect(profiler.finish).to.throw();
            });

            // TODO Verify that the clock stops.
        });

        describe('track() method', function () {
            it('should be a function', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler).to.have.property('track').which.is.a('function');
            });

            it('should return the same instance', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler.start()).to.equal(profiler);
            });

            it('should add the task from global tracking after being untracked individually', function () {
                let task = new Profiler(generateTaskName(this));
                task.untrack();
                expect(Profiler.tasks).to.not.include(task);
                task.track();
                expect(Profiler.tasks).to.include(task);
            });

            it('should add the task from global tracking after global tracking is reset', function () {
                let task = new Profiler(generateTaskName(this));
                Profiler.reset();
                expect(Profiler.tasks).to.not.include(task);
                task.track();
                expect(Profiler.tasks).to.include(task);
            });

            it('should not disrupt other tasks in global tracking', function () {
                // Create some tasks and set up for the test.
                let earlierTask = new Profiler(generateTaskName(this, 'Earlier'));
                let trackingTask = new Profiler(generateTaskName(this, 'Tracked'));
                trackingTask.untrack();
                let laterTask = new Profiler(generateTaskName(this, 'Later'));
                expect(Profiler.tasks).to.have.members([earlierTask, laterTask]);

                // Track the task again.
                trackingTask.track();
                expect(Profiler.tasks).to.have.members([trackingTask, earlierTask, laterTask]);
            });

            // TODO Test the track() functionality
        });

        describe('untrack() method', function () {
            it('should be a function', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler).to.have.property('untrack').which.is.a('function');
            });

            it('should return the same instance', function () {
                let profiler = new Profiler(generateTaskName(this));
                expect(profiler.start()).to.equal(profiler);
            });

            it('should remove the task from global tracking', function () {
                let task = new Profiler(generateTaskName(this));
                expect(Profiler.tasks).to.include(task);
                task.untrack();
                expect(Profiler.tasks).to.not.include(task);
            });

            it('should not disrupt other tasks in global tracking', function () {
                // Create some tasks and set up for the test.
                let earlierTask = new Profiler(generateTaskName(this, 'Earlier'));
                let trackingTask = new Profiler(generateTaskName(this, 'Untracked'));
                let laterTask = new Profiler(generateTaskName(this, 'Later'));
                expect(Profiler.tasks).to.have.members([earlierTask, trackingTask, laterTask]);

                // Untrack the task
                trackingTask.untrack();
                expect(Profiler.tasks).to.have.members([earlierTask, laterTask]);
            });
        });

        describe('time tracking', function () {
            it('should be accurate for started tasks', function () {
                let profiler = new Profiler(generateTaskName(this));
                profiler.start();
                let startTime = process.hrtime();

                // Wait a random amount of time.
                return wait().then(() => {
                    let elapsedTime = process.hrtime(startTime);

                    // Profiler state should be started.
                    expect(profiler).to.have.property('state', 'Started');

                    // Profiler elapsed time should be accurate.
                    expectTimesToMatch(profiler, elapsedTime);
                    return wait().then(() => {
                        // Profiler elapsed time should continue counting.
                        let additionalElapsedTime = process.hrtime(startTime);
                        expectTimesToMatch(profiler, additionalElapsedTime);
                    });
                });
            });

            it('should be accurate for finished tasks', function () {
                let profiler = new Profiler(generateTaskName(this));
                profiler.start();
                let startTime = process.hrtime();

                // Wait a random amount of time.
                return wait().then(() => {
                    profiler.finish();
                    let elapsedTime = process.hrtime(startTime);

                    // Profiler state should be finished.
                    expect(profiler).to.have.property('state', 'Finished');

                    // Profiler elapsed time should be accurate.
                    expectTimesToMatch(profiler, elapsedTime);
                    return wait().then(() => {
                        // Profiler elapsed time should not have changed.
                        expectTimesToMatch(profiler, elapsedTime);
                    });
                });
            });

            it('should be accurate for at least a minute', function () {
                // Skip this test if running in "fast" mode.
                if (process.argv.includes('--quickly')) this.skip();

                // Set a longer test timeout.
                this.timeout(61000);

                let profiler = new Profiler(generateTaskName(this));
                profiler.start();
                let startTime = process.hrtime();

                const testAccuracy = () => {
                    let elapsedTime = process.hrtime(startTime);
                    expectTimesToMatch(profiler, elapsedTime);
                };

                // Execute all tests in parallel, to take the minimum amount of time required.
                return Promise.all([
                    wait(5000).then(() => testAccuracy()),
                    wait(10000).then(() => testAccuracy()),
                    wait(15000).then(() => testAccuracy()),
                    wait(30000).then(() => testAccuracy()),
                    wait(45000).then(() => testAccuracy()),
                    wait(60000).then(() => testAccuracy())
                ]);
            });
        });
    });
});

function generateTaskName(context, additional) {
    return `Test: ${context.test.parent.title} ${context.test.title}${additional ? ` - ${additional}` : ''}`;
}

function expectTimesToMatch(profiler, expectedHrTime) {
    // Collect times. (This prevents further drift while processing the results.)
    let {hrtime, nanoseconds, milliseconds, seconds} = profiler;
    let hrtimeToNanoseconds = (hrtime[0] * 1e+9) + hrtime[1];
    let expectedNanoseconds = (expectedHrTime[0] * 1e+9) + expectedHrTime[1];
    let expectedMilliseconds = (expectedHrTime[0] * 1000) + (expectedHrTime[1] / 1e+6);
    let expectedSeconds = expectedHrTime[0] + (expectedHrTime[1] / 1e+9);

    // All times should be accurate to within 1ms.
    const NANOSECONDS_TOLERANCE = 1e+6;
    const MILLISECONDS_TOLERANCE = 1;
    const SECONDS_TOLERANCE = 0.001;

    // Test all the times.
    expect(hrtimeToNanoseconds).to.be.approximately(expectedNanoseconds, NANOSECONDS_TOLERANCE, 'Nanoseconds');
    expect(nanoseconds).to.be.approximately(expectedNanoseconds, NANOSECONDS_TOLERANCE, 'Nanoseconds');
    expect(milliseconds).to.be.approximately(expectedMilliseconds, MILLISECONDS_TOLERANCE, 'Milliseconds');
    expect(seconds).to.be.approximately(expectedSeconds, SECONDS_TOLERANCE, 'Seconds');
}

/**
 * Returns a promise and waits a specified amount of time before resolving it.
 * If no time is provided, a random time will be selected between 100 and 500 milliseconds.
 * @property {number} [time] - number of milliseconds to wait
 * @return {Promise} - promise to return
 */
function wait(time) {
    // Generate a random time to wait.
    if (!time) time = Math.floor(Math.random() * 400) + 100;

    // Wait the specified time.
    return new Promise(resolve => setTimeout(() => resolve(), time));
}
