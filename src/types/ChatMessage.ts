export type ChatMessage = {
    id: string;
    type: 'me' | 'other';
    text: string;
}