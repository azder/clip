export const PEEK = Symbol('peek');
export const ABOO = Symbol('aboo');

export const next$ = (

    generator => generator.next()

);


export const peek$ = (

    generator => {

        const item = generator.next();

        const {value} = item;
        generator.next({[PEEK]: true, [ABOO]: value});

        return item;
    }

);

