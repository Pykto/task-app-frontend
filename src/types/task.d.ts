export type Task = {
    id: Number,
    title: String,
    description: String,
    state: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    priority: 'LOW' | 'MEDIUM' | 'HIGH',
    creation_date: String,
    expiration_date: String | null,
}

export interface FormState {
    title: string;
    description: string;
    priority: Task['priority'];
    expiration_date: string | undefined;
    state?: Task[state];
}