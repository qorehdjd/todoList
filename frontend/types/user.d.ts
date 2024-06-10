export interface userData {
  _id: string;
  nickname: string;
  likePosts: { nickname: string }[];
  dislikePosts: { nickname: string }[];
  subscriptionPeriod: Date;
}

export interface InittialState {
  me: userData | null;
  certificatedUser: boolean;
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
