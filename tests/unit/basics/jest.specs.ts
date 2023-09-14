import 'jest-extended';

class Name {
    public readonly firstname: string | null;

    constructor(firstname: string | null) {
        this.firstname = firstname;
    }
}

describe('basics', (): void => {
    test('Test Jest', (): void => {
        const name = new Name('Mike');

        expect(name.firstname).toStartWith('Mi');
    });
});
