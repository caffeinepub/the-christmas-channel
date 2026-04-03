import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DJ {
    id: bigint;
    bio: string;
    name: string;
    specialty: string;
    photoUrl: string;
}
export interface UserProfile {
    name: string;
}
export interface Show {
    endHour: bigint;
    hostName: string;
    dayOfWeek: bigint;
    description: string;
    showName: string;
    startHour: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDJ(name: string, bio: string, specialty: string, photoUrl: string): Promise<bigint>;
    addShow(show: Show): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllShows(): Promise<void>;
    getAllShows(): Promise<Array<Show>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentShow(): Promise<Show | null>;
    getDJs(): Promise<Array<DJ>>;
    getShowsForDay(dayOfWeek: bigint): Promise<Array<Show>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeDJ(djId: bigint): Promise<void>;
    removeShow(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateShow(id: bigint, show: Show): Promise<void>;
}
