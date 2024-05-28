export interface userData {
  _id: string;
  nickname: string;
  likePosts: { nickname: string }[];
  dislikePosts: { nickname: string }[];
}

export interface InittialState {
  me: userData | null;
  signupLoading: boolean;
  signupDone: boolean;
  signupError: boolean | any;
  loginLoading: boolean;
  loginDone: boolean;
  loginError: boolean | any;
  logoutloading: boolean;
  logoutDone: boolean;
  logoutError: boolean | any;
  autoLoginLoading: boolean;
  autoLoginDone: boolean;
  autoLoginError: boolean | any;
}
