/**
 * Recursively maps 'id' to '_id' for frontend compatibility
 */
export function mapId(data) {
    if (!data) return data;

    if (Array.isArray(data)) {
        return data.map(item => mapId(item));
    }

    if (typeof data === 'object') {
        // Don't recurse into Date objects, just return them
        if (data instanceof Date) return data;

        const newData = { ...data };
        if (newData.id && !newData._id) {
            newData._id = newData.id;
        }

        // Recursively map nested objects (only if they are plain objects or arrays)
        for (const key in newData) {
            const val = newData[key];
            if (typeof val === 'object' && val !== null && !(val instanceof Date)) {
                newData[key] = mapId(val);
            }
        }
        return newData;
    }

    return data;
}

export function getFileExecution(language) {
    const extensions = { javascript: ".js", python: ".py", java: ".java" };
    return extensions[language] || ".js";
}
