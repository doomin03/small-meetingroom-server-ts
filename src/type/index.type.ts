enum CralwerType {
    LOGIN = 1,
    DELETE = 2,
    UPDATE = 3,
}

export interface Job<T = any> {
    tpye: CralwerType;
    payload: T;
    createdAt: number;
}