export interface PutRumEventsRequest {
    BatchId: string;
    AppMonitorDetails: AppMonitorDetails;
    UserDetails: UserDetails;
    RumEvents: RumEvent[];
}
export interface AppMonitorDetails {
    id?: string;
    version?: string;
}
export interface UserDetails {
    userId?: string;
    sessionId?: string;
}
export interface RumEvent {
    id: string;
    timestamp: Date;
    type: string;
    metadata?: string;
    details: string;
}
