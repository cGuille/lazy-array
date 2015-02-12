(function () {
    'use strict';

    var hasWindow = typeof(window) !== 'undefined';
    var hasConsole = (!hasWindow || window.console);
    function noop() {}

    if (!hasConsole) {
        var logger = { debug: noop, error: noop };
    } else {
        var logger = {
            debug: console.log.bind(console, 'lazy'),
            error: console.error.bind(console, 'lazy'),
        };
    }

    if (Array.prototype.lazy) {
        logger.error('Array.prototype.lazy is already define.');
        return;
    }

    Object.defineProperty(Array.prototype, 'lazy', {
        configurable: false,
        enumerable: false,
        get: lazy,
    });

    function lazy() {
        logger.debug('Being lazy, now.');
        return new LazyArray(this);
    }

    function LazyArray(array) {
        this.array = array;
        this.queue = [];
        logger.debug('LazyArray constructed.')
    }

    var TYPE = {
        EACH: 'each',
        FILTER: 'filter',
        MAP: 'map',
    };

    LazyArray.prototype.forEach = function LazyArray_forEach(fn, thisArg) {
        this.queue.push({
            type: TYPE.EACH,
            fn: fn,
            thisArg: thisArg,
        });
        logger.debug('enqueue:', this.queue[this.queue.length - 1]);

        return this;
    };

    LazyArray.prototype.filter = function LazyArray_filter(fn, thisArg) {
        this.queue.push({
            type: TYPE.FILTER,
            fn: fn,
            thisArg: thisArg,
        });
        logger.debug('enqueue:', this.queue[this.queue.length - 1]);

        return this;
    };

    LazyArray.prototype.map = function LazyArray_map(fn, thisArg) {
        this.queue.push({
            type: TYPE.MAP,
            fn: fn,
            thisArg: thisArg,
        });
        logger.debug('enqueue:', this.queue[this.queue.length - 1]);

        return this;
    };

    LazyArray.prototype.collect = function LazyArray_collect() {
        var elementIndex = 0;
        var result = [];
        var filtered;
        var i, element;
        var j, processor;

        elementsLoop:
        for (i = 0; i < this.array.length; ++i) {
            element = this.array[i];
            processorsLoop:
            for (j = 0; j < this.queue.length; ++j) {
                processor = this.queue[j];
                logger.debug('processing', processor);
                switch (processor.type) {
                case TYPE.EACH:
                    processor.fn.call(processor.thisArg, element, elementIndex, this.array);
                    break;
                case TYPE.FILTER:
                    filtered = !processor.fn.call(processor.thisArg, element, elementIndex, this.array);
                    if (filtered) {
                        continue elementsLoop;
                    }
                    break;
                case TYPE.MAP:
                    element = processor.fn.call(processor.thisArg, element, elementIndex, this.array);
                    break;
                default:
                    if (logError) {
                        logError('Unknown processor type:', processor.type);
                    }
                    break;
                }
            }
            ++elementIndex;
            result.push(element);
        }

        return result;
    };
}());
