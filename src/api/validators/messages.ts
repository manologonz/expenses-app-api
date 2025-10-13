export function requiredMessage(field: string) {
    return `[${field}] is a required field`;
}

export function stringMessage(field: string) {
    return `[${field}] must be string`;
}

export function emptyStringMessage(field: string) {
    return `[${field}] can't be an empty string`;
}

export function arrayMessage(field: string) {
    return `[${field}] must be an array`;
}

export function emptyArrayMessage(field: string) {
    return `[${field}] can't be an empty array`;
}

export function intMessage(field: string) {
    return `[${field}] must be an integer`;
}

export function floatMessage(field: string) {
    return `[${field}] must be float`;
}

export function dateMessage(field: string, format: string = 'yyyy-mm-dd') {
    return `[${field}] must be a valid date, try format [${format}]`;
}

export function notCeroMessage(field: string) {
    return `[${field}] can't be zero`;
}

export function booleanMessage(field: string) {
    return `[${field}] must be boolean`;
}

export function emailMessage(field: string) {
    return `[${field}] must be a valid email`;
}
