describe("A suite is just a function grouping tests usually of a same module or feature", () => {
    it("A spec is just a function for testing a portion of the module", () => {
        // Suppose this is a function we are going to test.
        function double(num) {
            return num * 2;
        }

        // Inside a spec we can use *expect* to check things are working as expect.
        // And generally, at least 1 expectation is required for forming a 'valid' spec.
        // It's usually used to check the result is something:
        expect(double(1)).toEqual(2);
        // or the result is not something by chaining a *.not* before matchers:
        expect(double(1)).not.toEqual(1);
        // the *toEqual* is a matcher function, find more following this link:
        // https://jasmine.github.io/api/edge/matchers.html
    });

    it("what is a spy", () => {
        // It's very common we need to test a specific state of our application. So we provide data designed
        // on purpose and test-double functions. A spy is just a such test-double function, and it has a
        // bunch of properties and functions for recording things have been done to it, eg the arguments
        // passed in when it's invoked by the application.

        // To create a spy
        const foo = jasmine.createSpy("name-of-the-spy");
        // invoke it just as normal functions
        foo();
        // we could verify if the spy has been called
        expect(foo).toHaveBeenCalled();

        // we can even pass in arguments
        foo(1, 2, 3);
        // and check if arguments are passed in correctly with
        expect(foo).toHaveBeenCalledWith(1, 2, 3);

        // You could also specify the return value
        foo.and.returnValue(1);
        // and whatever you passed in, it will always return the given value, 1 in this example
        expect(foo(1, 2, 3)).toEqual(1);

        // And you could do a lot more with spies, referrals:
        // https://jasmine.github.io/api/edge/Spy_calls.html
        // https://jasmine.github.io/api/edge/Spy.html
        // https://jasmine.github.io/api/edge/SpyStrategy.html
    });

    it("more fine grained matchers", () => {
        // Sometimes the trivial matchers like the following one don't meet the needs of
        // testing complicated applications.
        //expect("something").toEqual("something");

        // Then we can pass matchers (please notice the difference with chained matchers) in to matcher functions,
        // e.g. *toEqual*, *toContain*, *toHaveBeenCalledWith*.
        // The matchers are functions too, it will take the actual value as input and output the comparision result.
        // Here we create a matcher which will check if the actual value is an object and has a property *foo*
        // with value 1.
        const fooMatcher = jasmine.objectContaining({ foo: 1 });
        expect({ foo: 1, bar: 2 }).toEqual(fooMatcher);
        // There are a lot of other matchers functions out-of-the-box, please refer to this link for more details
        // https://jasmine.github.io/api/edge/jasmine.html
        // - jasmine.stringMatching
        // - jasmine.arrayContaining
        // - jasmine.arrayWithExactContents
        // - ...

        // Another way to control the comparision is to create custom matchers or customer argument matchers.
        // (1) A custom matcher has the following signature:
        function largeEnoughThan() {
            return {
                compare(actual, expected) {
                    const result = {
                        pass: actual > expected * 2
                    };
                    if (!result.pass) {
                        result.message = `${actual} is not large enough than ${expected}`;
                    }
                    return result;
                }
            }
        }

        // Let's first see how to enable it.
        // jasmine.addMatchers takes a hash of matcher functions,
        jasmine.addMatchers({ largeEnoughThan });
        // the key of the hash is used as the matcher name in the expect chain.
        expect(100).largeEnoughThan(30);
        // Let's explain the custom matcher signature:
        // - it's an function.
        // - must return an object with a function named exactly *compare*.
        // - the compare function will be invoked by jasmine with two arguments,
        //   the first is the one passed in in expect(100), and the second is the one in largeEnoughThan(30).
        // - the compare function should return an object containing a *pass* property whose value is either
        //   either *true* or *false* to indicate the expectation is successful or unsuccessful.
        // - it's always good to provide an meaningful error *message* when pass is marked as false.

        // (2) You can also define custom-argument-matchers, like jasmine.objectContaining they are passed in to
        // matcher functions e.g. *toEqual*, *toContain* and *toHaveBeenCalledWith*.
        // A custom argument matcher has the following signature:
        // - A *asymmetricMatch* to compare if the expected value satisfies the actual value.
        // - A *jasmineToString* to return the stringify version of the expected value.
        function doubleOf(expectedValue) {
            return {
                asymmetricMatch(actualValue) {
                    return actualValue === expectedValue * 2;
                },
                jasmineToString() {
                    return `(${expectedValue} * 2)`;
                }
            }
        }

        // Use it directly without installing to jasmine
        expect(2).toEqual(doubleOf(1));
    });

    // Suite can be nested.
    describe("How to test asynchronous code", () => {
        // If an argument is given when defining a spy, jasmine will pass a function (usually named done)
        // to the spy at the time it's being executed. The callback should be invoked after the asynchronous work
        // has been done and all the expectation statements have been executed. You could also call
        // *callback.fail*(since 2.1) or *done(new Error("msg"))*(since 3.0) to mark the spy as failed.
        // If none, either done() or done.fail(), is invoked there would be an timeout error after 5 seconds by default.
        it("(1) use a callback function to test asynchronous code", (done) => {
            setTimeout(() => {
                done();
                // Use *done.fail()* or *done(new Error("msg"))* to fail a spy manually if needed.
                // done.fail();
            }, 100);
        });

        // The default timeout value can be set by assigning a new value to jasmine.DEFAULT_TIMEOUT_INTERVAL,
        // usually outside of the target *describe*.

        // Similar to callback approach, if no resolve or reject is invoked within 5 seconds,
        // this spy will fail with a timeout error.
        it("(2) use promises to test asynchronous code", () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                    // or fail this spy with
                    // reject("error message");
                }, 100);
            });
        });

        // The third approach is to us async/await keywords.
        // In the same way it's restricted by the timeout limitation 5 seconds by default.
        it("(3) use async/await to test asynchronous code", async () => {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                    // or fail this spy with
                    // reject("error message");
                }, 100);
            });
        });

        // Another way to test asynchronous code is to wait some time if you know the maximum execution time
        // of the asynchronous code. This wait can be done by calling *jasmine.clock().tick(<time>)*.
        // However, you should first install before using it and uninstalled it afterwards.
        it("(4) use clock to wait a specific period of time", () => {
            // install
            jasmine.clock().install();

            const foo = jasmine.createSpy("foo");
            setTimeout(foo, 100);
            expect(foo).not.toHaveBeenCalled();

            // wait
            jasmine.clock().tick(100);

            expect(foo).toHaveBeenCalled();

            // uninstall
            jasmine.clock().uninstall();
        });
    });
});