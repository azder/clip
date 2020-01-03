import {inspect} from 'util';

export const keysOf = (
    $ => Object.keys($).sort()
);

export const valuesOf = (
    $ => Object.values($).sort()
);

export const entriesOf = (
    $ => Object.entries($).sort()
);


const INSPECT_OPTIONS = {showHidden: false, depth: null, colors: true};

export const insp = ($ => inspect($, INSPECT_OPTIONS));


export const print = (

    // eslint-disable-next-line no-console
    (...args) => console.log(...args.map(insp))

);
