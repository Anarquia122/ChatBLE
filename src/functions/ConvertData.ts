function stringToBytes(str: string): number[] {
    return Array.from(new TextEncoder().encode(str));
}

function bytesToString(bytes: number[]): string {
    try {
        if (!Array.isArray(bytes) || bytes.length === 0) {
            throw new Error("Array vazio ou inválido");
        }

        const uint8Array = new Uint8Array(bytes);
        const str = Array.from(uint8Array, (c) => String.fromCharCode(c)).join('');
        return str;
    } catch (err) {
        return `(UTF-8 error) [${bytes.join(", ")}] - ${bytes}`;
    }
}

export { stringToBytes, bytesToString };