export function safeString(string: string): string {
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    string = string.replace(/\s+/g, "_");
    string = string.replace(/[^a-zA-Z0-9_]/, "");
    return string;
}
