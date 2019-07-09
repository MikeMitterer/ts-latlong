/**
 * Will be thrown if distance calculation fails
 */
export class StateError extends Error {
    constructor(message?: string) {
        // 'Error' breaks prototype chain here
        super(message);

        // restore prototype chain
        const actualProto = new.target.prototype;

        // see: https://stackoverflow.com/a/48342359/504184

        // @ts-ignore
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        } else {
            // @ts-ignore
            this.__proto__ = actualProto;
        }

        // this.name = StateError.name; // stack traces display correctly now
    }
}
