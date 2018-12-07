export const capitalize = word =>
    word.charAt(0).toUpperCase() + word.substr(1, word.length);

/**
 * Merges source objects into target object;
 * Arrays: arrays will be concated (!not overridden)
 * Object: merged
 * All other is overridden
 */
export const deepMerge = (target, ...sources: object[]) => {
    const merge = (target, source) => Object
        .keys(source)
        .reduce((t, key) => {
            const targetValue = t[key];
            const sourceValue = source[key];

            const isTargetValueArray = Array.isArray(targetValue);
            const isTargetValueObject = targetValue && typeof t[key] === 'object';

            if (isTargetValueArray) {
                t[key] = targetValue.concat(sourceValue);
            } else if (isTargetValueObject) {
                t[key] = merge(targetValue, sourceValue);
            } else {
                t[key] = sourceValue;
            }
            return t;
        }, target);

    return sources.reduce((t, source) => merge(t, source), target);
};

const merged = deepMerge({
    a1: 1,
    a2: 2,
    b: {
        b1: 'b11',
        b2: 'b21',
    },
    c: ['c1'],
}, {
    a2: 'changed',
    b: {
        b2: 'changed',
        b3: 'added',
    },
    c: ['added'],
});

''