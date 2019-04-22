const { parse:csvParser } = require('json2csv');

/**
 * The possible states a task can be in.
 * @private
 * @type {{PENDING: string, STARTED: string, FINISHED: string}}
 */
const STATE = {
    PENDING: 'Pending',
    STARTED: 'Started',
    FINISHED: 'Finished'
};

/**
 * The maximum number of seconds that can be safely converted to milliseconds.
 * @private
 * @type {number}
 */
const MAX_SAFE_MILLISECOND_CONVERSION = Math.floor(Number.MAX_SAFE_INTEGER / 1000);

/**
 * The maximum number of seconds that can be safely converted to nanoseconds.
 * @private
 * @type {number}
 */
const MAX_SAFE_NANOSECONDS_CONVERSION = Math.floor(Number.MAX_SAFE_INTEGER / 1e+9);

/**
 * All currently tracked tasks.
 * @type {Set<Profiler>}
 */
let trackedTasks = new Set();

// TODO Consider removing all errors and instead fail gracefully with a console log.


/**
 * Tracks high-resolution timing data for multiple tasks in order to identify slow operations.
 *
 * @example
 * // Import the module.
 * const Profiler = require('./Profiler');
 *
 * // Get a task instance, with a friendly name.
 * let myTask = new Profiler("Just Some Stuff");
 *
 * // PREPARE YOUR STUFF
 *
 * // Start the task.
 * myTask.start();
 *
 * // DO STUFF
 *
 * // Finish the task.
 * myTask.finish();
 *
 * // Print the csv report.
 * console.log(Profiler.csv());
 *
 * @example
 * // Most instance methods return the instance and can be chained together, for example:
 * let myTask = new Profiler("Create and Start").start().untrack();
 */
class Profiler {

    /**
     * Generate a csv report detailing all currently tracked tasks.
     *
     * @param {string} scale=milliseconds - timing scale for the csv: 'nanoseconds', 'milliseconds', or 'seconds'
     */
    static csv(scale = 'milliseconds') {
        const VALID_SCALES = ['nanoseconds', 'milliseconds', 'seconds'];
        if (!VALID_SCALES.includes(scale)) throw new Error(`Invalid report scale: '${scale}`);

        return csvParser(this.tasks, {fields: ['name', 'state', scale]});
    }

    /**
     * Delete all existing tasks from global tracking.
     * Any such tasks can still be used individually, but they won't be included in the csv.
     */
    static reset() { trackedTasks = new Set(); }

    /**
     * Returns a list of all currently tracked tasks, in no particular order.
     * This array is a shallow copy and is not backed by the underlying list.
     *
     * @return {Profiler[]} a list of all currently-tracked tasks
     */
    static get tasks() { return [...trackedTasks]; }

    /**
     * Create a new instance, usually called a "task".
     * Tasks start in the "Pending" state and are automatically added to global tracking.
     * @param {string} name - a friendly name to be used in reports
     */
    constructor(name) {
        if (!name || typeof name !== 'string') throw new Error('profile.name must be a non-empty string.');
        this._name = name;
        this._state = STATE.PENDING;
        this.track();
    }

    /**
     * Start the clock on the task.
     * The task must be in the "Pending" state and is immediately changed to "Started".
     *
     * @return {Profiler} the instance
     */
    start() {
        if (this._state !== STATE.PENDING) throw new Error(`profiler.start() called on ${this._state} task.`);
        this._startTime = process.hrtime();
        this._state = STATE.STARTED;
        return this;
    }


    /**
     * Stop the clock on the task.
     * The task must be in the "Started" state and is immediately changed to "Finished".
     * Finished tasks cannot be restarted.
     *
     * @return {Profiler} the instance
     */
    finish() {
        if (this._state !== STATE.STARTED) throw new Error(`profiler.finish() called on ${this._state} task.`);
        this._elapsedTime = process.hrtime(this._startTime);
        this._state = STATE.FINISHED;
        return this;
    }

    /**
     * Add this task to global tracking.
     *
     * @return {Profiler} the instance
     */
    track() {
        trackedTasks.add(this);
        return this;
    }

    /*
     * Remove this task from global tracking.
     *
     * @return {Profiler} the instance
     */
    untrack() {
        trackedTasks.delete(this);
        return this;
    }

    /**
     * @return {string} the tasks's friendly name as set in the constructor
     */
    get name() { return this._name; }

    /**
     * @return {string} the task's current state: either "Pending", "Started", or "Finished"
     */
    get state() { return this._state; }

    /**
     * Returns the raw high-resolution elapsed time for the task.
     * "Pending" tasks always return zero time spent.
     * "Started" tasks return the amount of time passed since calling {@link Profiler.start()}.
     * "Finished" tasks return the elapsed time between calling {@link profiler.start()} and {@link Profiler.finish()}.
     * @return {Array} [seconds, nanoseconds] - an array similar to {@link process.hrtime()}
     */
    get hrtime() {
        let {state} = this;
        if (state === STATE.PENDING) return [0, 0];
        if (state === STATE.STARTED) return process.hrtime(this._startTime);
        if (state === STATE.FINISHED) return this._elapsedTime;
        throw new Error(`Task is in an invalid state: ${state}`);
    }

    /**
     * Returns the value of {@link Profiler.hrtime} expressed in seconds.
     * @return {number} - decimal number of seconds elapsed for the task
     */
    get seconds() {
        let [seconds, nanoseconds] = this.hrtime;
        return seconds + (nanoseconds / 1e+9);
    }

    /**
     * Returns the value of {@link Profiler.hrtime} expressed in milliseconds.
     * @return {number} - decimal number of milliseconds elapsed for the task
     */
    get milliseconds() {
        let [seconds, nanoseconds] = this.hrtime;
        if (seconds > MAX_SAFE_MILLISECOND_CONVERSION) throw new Error('Elapsed time too long for milliseconds.');
        return (seconds * 1000) + (nanoseconds / 1e+6);
    }

    /**
     * Returns the value of {@link Profiler.hrtime} expressed in nanoseconds.
     * @return {number} - integer number of milliseconds elapsed for the task
     */
    get nanoseconds() {
        let [seconds, nanoseconds] = this.hrtime;
        if (seconds > MAX_SAFE_NANOSECONDS_CONVERSION) throw new Error('Elapsed time too long for nanoseconds.');
        return (seconds * 1e+9) + nanoseconds;
    }
}

module.exports = Profiler;
