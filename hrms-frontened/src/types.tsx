
export interface AuthState {
    accessToken: string | null;
    isAuthenticated : boolean | null;
    role : string ;
    userId : number | null;
    firstName : string | null
    navTitle : string | null
   
  }
  
  export interface RootState {
    auth: AuthState;
  }
  