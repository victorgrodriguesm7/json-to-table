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

export function fieldsToTitle(field: string[]): string {
    return field.map((n, i) => i == 0 ? n.toLowerCase() : capitalize(n.toLowerCase())).join("");
}

export function accessDynamicField(path: string[], object: Record<string, unknown>){
    if (path.length == 0 || object == null) return object;

    //@ts-ignore
    return accessDynamicField(path.slice(1), object[path[0]])
}

export function downloadBlob(binaryData: Uint8Array, mimeType: string, filename: string) {
    const blob = new Blob([binaryData], { type: mimeType });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = filename; 

    a.click();

    URL.revokeObjectURL(url);
}