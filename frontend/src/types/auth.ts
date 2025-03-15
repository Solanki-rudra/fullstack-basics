import { JSX } from "react";

export type AuthGuardProps = {
    children: JSX.Element;
};

export interface RegisterFormValues {
    username: string;
    email: string;
    fullName: string;
    password: string;
    avatar?: File;
    thumbnail?: File;
}