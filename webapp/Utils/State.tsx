export interface State {
    text: string;
    confirmation: string;
    deny: string;
    onDeny?: () => void;
    onConfirmation?: () => void;
}
