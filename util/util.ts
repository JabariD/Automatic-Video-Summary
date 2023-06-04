/** Utility methods that can be used throughout the backend, in multiple components. */
class Util {
    // Returns true if the object is null or undefined or length is 0, false otherwise.
    public static isNullOrUndefined(obj: any): boolean {
        return obj === null || obj === undefined || obj.length === 0;
    }

    // Returns a Promise that resolves after the given number of seconds.
    //
    // USAGE: await this.sleep(/*sec=*/1);
    public static Sleep(sec: number) : Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, sec * 1000));
    }
};

export default Util;