/** Utility methods that can be used throughout the backend, in multiple components. */
class Util {
    // Returns true if the object is null or undefined, false otherwise.
    public static isNullOrUndefined(obj: any): boolean {
        return obj === null || obj === undefined || obj.length === 0;
    }


};

export default Util;