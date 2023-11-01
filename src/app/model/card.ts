export interface Card {
    id: string;
    list_id: string;
    board_id: string;
    position: number;
    title: string;
    done : boolean;
    user_id: string;
    // created_at: typeof timestamp;
}