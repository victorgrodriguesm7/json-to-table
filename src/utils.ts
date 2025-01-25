export function isPlainObject(value: unknown) {
    return Object.getPrototypeOf(value) === Object.prototype;
}

export function capitalize(word: string) {
    if (!word) return ''; // Caso a string seja vazia ou undefined
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function checkJson(rawJson: string): [boolean, string, Record<string, unknown>[]]{
    try {
        const parsedJson = JSON.parse(rawJson);

        return [true, "", parsedJson]
    } catch (error) {
        return [false, "Invalid JSON", [{}]]
    }
}


export function getJsonFields(json: Record<string, unknown>): string[][]{
    const fields: string[][] = [];

    for (const key of Object.keys(json)){
        const value = json[key];

        if (isPlainObject(value)){
            const nestedFields = getJsonFields(value as Record<string, unknown>);

            for (const nestedField of nestedFields){
                fields.push([
                    key,
                    ...nestedField
                ])
            }

            continue;
        }

        fields.push([key])
    }

    return fields;
}

export function accessDynamicField(path: string[], object: Record<string, unknown>){
    if (path.length == 0) return object;

    //@ts-ignore
    return accessDynamicField(path.slice(1), object[path[0]])
}
