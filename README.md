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
## Classes

<dl>
<dt><a href="#Profiler">Profiler</a></dt>
<dd><p>Tracks high-resolution timing data for multiple tasks in order to identify slow operations.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#trackedTasks">trackedTasks</a> : <code><a href="#Profiler">Set.&lt;Profiler&gt;</a></code></dt>
<dd><p>All currently tracked tasks.</p>
</dd>
</dl>

<a name="Profiler"></a>

## Profiler
Tracks high-resolution timing data for multiple tasks in order to identify slow operations.

**Kind**: global class  

* [Profiler](#Profiler)
    * [new Profiler(name)](#new_Profiler_new)
    * _instance_
        * [.name](#Profiler+name) ⇒ <code>string</code>
        * [.state](#Profiler+state) ⇒ <code>string</code>
        * [.hrtime](#Profiler+hrtime) ⇒ <code>Array</code>
        * [.seconds](#Profiler+seconds) ⇒ <code>number</code>
        * [.milliseconds](#Profiler+milliseconds) ⇒ <code>number</code>
        * [.nanoseconds](#Profiler+nanoseconds) ⇒ <code>number</code>
        * [.start()](#Profiler+start) ⇒ [<code>Profiler</code>](#Profiler)
        * [.finish()](#Profiler+finish) ⇒ [<code>Profiler</code>](#Profiler)
        * [.track()](#Profiler+track) ⇒ [<code>Profiler</code>](#Profiler)
    * _static_
        * [.tasks](#Profiler.tasks) ⇒ [<code>Array.&lt;Profiler&gt;</code>](#Profiler)
        * [.csv(scale)](#Profiler.csv)
        * [.reset()](#Profiler.reset)

<a name="new_Profiler_new"></a>

### new Profiler(name)
Create a new instance, usually called a "task".
Tasks start in the "Pending" state and are automatically added to global tracking.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | a friendly name to be used in reports |

**Example**  
```js
// Import the module.
const Profiler = require('./Profiler');

// Get a task instance, with a friendly name.
let myTask = new Profiler("Just Some Stuff");

// PREPARE YOUR STUFF

// Start the task.
myTask.start();

// DO STUFF

// Finish the task.
myTask.finish();

// Print the csv report.
console.log(Profiler.csv());
```
**Example**  
```js
// Most instance methods return the instance and can be chained together, for example:
let myTask = new Profiler("Create and Start").start().untrack();
```
<a name="Profiler+name"></a>

### profiler.name ⇒ <code>string</code>
**Kind**: instance property of [<code>Profiler</code>](#Profiler)  
**Returns**: <code>string</code> - the tasks's friendly name as set in the constructor  
<a name="Profiler+state"></a>

### profiler.state ⇒ <code>string</code>
**Kind**: instance property of [<code>Profiler</code>](#Profiler)  
**Returns**: <code>string</code> - the task's current state: either "Pending", "Started", or "Finished"  
<a name="Profiler+hrtime"></a>

### profiler.hrtime ⇒ <code>Array</code>
Returns the raw high-resolution elapsed time for the task.
"Pending" tasks always return zero time spent.
"Started" tasks return the amount of time passed since calling [Profiler.start()](Profiler.start()).
"Finished" tasks return the elapsed time between calling [profiler.start()](profiler.start()) and [Profiler.finish()](Profiler.finish()).

**Kind**: instance property of [<code>Profiler</code>](#Profiler)  
**Returns**: <code>Array</code> - [seconds, nanoseconds] - an array similar to [process.hrtime()](process.hrtime())  
<a name="Profiler+seconds"></a>

### profiler.seconds ⇒ <code>number</code>
Returns the value of [Profiler.hrtime](Profiler.hrtime) expressed in seconds.

**Kind**: instance property of [<code>Profiler</code>](#Profiler)  
**Returns**: <code>number</code> - - decimal number of seconds elapsed for the task  
<a name="Profiler+milliseconds"></a>

### profiler.milliseconds ⇒ <code>number</code>
Returns the value of [Profiler.hrtime](Profiler.hrtime) expressed in milliseconds.

**Kind**: instance property of [<code>Profiler</code>](#Profiler)  
**Returns**: <code>number</code> - - decimal number of milliseconds elapsed for the task  
<a name="Profiler+nanoseconds"></a>

### profiler.nanoseconds ⇒ <code>number</code>
Returns the value of [Profiler.hrtime](Profiler.hrtime) expressed in nanoseconds.

**Kind**: instance property of [<code>Profiler</code>](#Profiler)  
**Returns**: <code>number</code> - - integer number of milliseconds elapsed for the task  
<a name="Profiler+start"></a>

### profiler.start() ⇒ [<code>Profiler</code>](#Profiler)
Start the clock on the task.
The task must be in the "Pending" state and is immediately changed to "Started".

**Kind**: instance method of [<code>Profiler</code>](#Profiler)  
**Returns**: [<code>Profiler</code>](#Profiler) - the instance  
<a name="Profiler+finish"></a>

### profiler.finish() ⇒ [<code>Profiler</code>](#Profiler)
Stop the clock on the task.
The task must be in the "Started" state and is immediately changed to "Finished".
Finished tasks cannot be restarted.

**Kind**: instance method of [<code>Profiler</code>](#Profiler)  
**Returns**: [<code>Profiler</code>](#Profiler) - the instance  
<a name="Profiler+track"></a>

### profiler.track() ⇒ [<code>Profiler</code>](#Profiler)
Add this task to global tracking.

**Kind**: instance method of [<code>Profiler</code>](#Profiler)  
**Returns**: [<code>Profiler</code>](#Profiler) - the instance  
<a name="Profiler.tasks"></a>

### Profiler.tasks ⇒ [<code>Array.&lt;Profiler&gt;</code>](#Profiler)
Returns a list of all currently tracked tasks, in no particular order.
This array is a shallow copy and is not backed by the underlying list.

**Kind**: static property of [<code>Profiler</code>](#Profiler)  
**Returns**: [<code>Array.&lt;Profiler&gt;</code>](#Profiler) - a list of all currently-tracked tasks  
<a name="Profiler.csv"></a>

### Profiler.csv(scale)
Generate a csv report detailing all currently tracked tasks.

**Kind**: static method of [<code>Profiler</code>](#Profiler)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| scale | <code>string</code> | <code>&quot;milliseconds&quot;</code> | timing scale for the csv: 'nanoseconds', 'milliseconds', or 'seconds' |

<a name="Profiler.reset"></a>

### Profiler.reset()
Delete all existing tasks from global tracking.
Any such tasks can still be used individually, but they won't be included in the csv.

**Kind**: static method of [<code>Profiler</code>](#Profiler)  
<a name="trackedTasks"></a>

## trackedTasks : [<code>Set.&lt;Profiler&gt;</code>](#Profiler)
All currently tracked tasks.

**Kind**: global variable  

<!-- END JSDOCS -->
