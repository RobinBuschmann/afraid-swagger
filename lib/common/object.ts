interface DeepAssign {
    <O1, O2>(obj1: O1, obj2: O2): O1 & O2;
    <O1, O2, O3>(obj1: O1, obj2: O2, obj3: O3): O1 & O2 & O3;
    <O1, O2, O3, O4>(obj1: O1, obj2: O2, obj3: O3, obj4: O4): O1 & O2 & O3 & O4;
}
/**
 * Merges specified objects and returns new object;
 * Arrays: arrays will be concated (!not overridden)
 * Object: merged
 * All other is overridden
 */
export const deepMerge: DeepAssign = (...objects: any[]) => {
    const mergeArrays = (target = [], source = []) => target.concat(source);
    const mergeObjects = (target = {}, source = {}) => Object
        .keys(source)
        .reduce((t, key) => {
            const targetValue = t[key];
            const sourceValue = source[key];

            const isArray = Array.isArray(targetValue) || Array.isArray(sourceValue);
            const isObject = (targetValue && typeof targetValue === 'object') ||
                (sourceValue && typeof sourceValue === 'object');

            if (isArray) {
                t[key] = mergeArrays(targetValue, sourceValue);
            } else if (isObject) {
                t[key] = mergeObjects(targetValue, sourceValue);
            } else {
                t[key] = sourceValue;
            }
            return t;
        }, target);

    return objects.reduce((t, obj) => mergeObjects(t, obj), {});
};
