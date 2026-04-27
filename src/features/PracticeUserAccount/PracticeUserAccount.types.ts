export interface Account {
    id: string;
    email: string;
    type: string;
    status: string;
    practice_name?: string | null;
    abn_number?: string | null;
    practice_type?: string | null;
    practice_phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    mobile?: string | null;
    practice_id?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface PracticeUser {
    id: string;
    name: string;
    email: string;
    access_level: string;
    user_access: boolean;
    multi_factor_auth: boolean;
    practice_id?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    type?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PracticeUserState {
    users: PracticeUser[];
    loading: boolean;
    error: string | null;
    updateLoading: boolean;
    deleteLoading: boolean;
    inviteLoading: boolean;
}

export interface InviteUserData {
    practice_id?: string | null;
    email: string;
    password: string;
    first_name?: string | null;
    last_name?: string | null;
    mobile?: string | null;
    type?: string;
    status?: string;
}

export interface UpdateUserData {
    id: string;
    access_level?: string;
    user_access?: boolean;
    multi_factor_auth?: boolean;
    first_name?: string | null;
    last_name?: string | null;
    mobile?: string | null;
    status?: string;
    type?: string;
}

export interface GraphQLAccount {
    id: string;
    email: string;
    type: string;
    status: string;
    practice_name?: string | null;
    abn_number?: string | null;
    practice_type?: string | null;
    practice_phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    mobile?: string | null;
    practice_id?: string | null;
    created_at?: string;
    updated_at?: string;
}