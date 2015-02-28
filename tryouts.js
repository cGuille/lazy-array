(function () {
    'use strict';

    require('./lazy-array');

    var arr = [1, 2, 3, 4, 5, 6];

    // Non chained calls are also supported:
    // arr.lazy.forEach(logElement);
    // arr.lazy.filter(isEven);
    // arr.lazy.forEach(logElement);
    // arr.lazy.map(mapElement);
    // console.log('result', arr.lazy.collect());

    console.log(
        'result',
        arr.lazy
            .forEach(logElement)
            .filter(isEven)
            .forEach(logElement)
            .map(mapElement)
            .collect()
    );

    function mapElement(element) {
        switch (element) {
        case 1:
            return 'un';
        case 2:
            return 'deux';
        case 3:
            return 'trois';
        case 4:
            return 'quatre';
        case 5:
            return 'cinq';
        case 6:
            return 'six';
        default:
            return 'oops';
        }
    }
    function logElement(element) {
        console.log(element);
    }
    function logArgs() {
        console.log('logArgs', arguments);
    }

    function isEven(n) {
        return n % 2 === 0;
    }
}());
