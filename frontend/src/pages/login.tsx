import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { login } from '../../reducers/user';
import { AppDispatch, RootState } from '../../store';

const HomeLayout = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .id_input,
  .password_input {
    height: 40px;
    width: 100%;
    margin: 20px auto;
    border-left: none;
    border-right: none;
    border-top: none;
    color: white;
    background: #0b2144;
    padding-left: 5px;
    font-family: FontAwesome, 'Open Sans', Verdana, sans-serif;
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
  }

  button {
    height: 40px;
    width: 100%;
    border-radius: 4px;
    margin-top: 30px;
    margin-bottom: 20px;
    border: none;
    background: #27d4e8;
    color: #ffffff;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 14pt;
    cursor: pointer;
  }

  form {
    width: 90%;
    margin: 40px auto;
    text-align: center;
  }

  input:focus {
    outline: none;
  }

  .auto_login_wrapper {
    display: flex;
    align-items: center;
    font-size: 2rem;
    text-align: left;
    input {
      margin-right: 7px;
      width: 18px;
      height: 18px;
    }
  }

  .logo {
    color: white;
    font-family: sans-serif;
    font-size: 15pt;
    font-weight: 600;
    text-align: center;
    padding-top: 40px;
  }

  .myform {
    background: #0b2144;
    width: 40%;
    height: fit-content;
    -webkit-box-shadow: 0px 0px 3px 1px rgba(38, 35, 128, 1);
    -moz-box-shadow: 0px 0px 3px 1px rgba(38, 35, 128, 1);
    box-shadow: 0px 0px 3px 1px rgba(38, 35, 128, 1);
  }

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #cccccc;
  }
  .fa-cloud-upload {
    font-size: 90px;
  }

  ::-moz-placeholder {
    /* Firefox 19+ */
    color: #cccccc;
  }

  :-ms-input-placeholder {
    /* IE 10+ */
    color: #cccccc;
  }

  :-moz-placeholder {
    /* Firefox 18- */
    color: #cccccc;
  }
  @media screen and (max-width: 800px) {
    .myform {
      width: 60%;
    }
  }
  @media screen and (max-width: 500px) {
    .myform {
      width: 90%;
    }
  }
`;

const Login = () => {
  const router = useRouter();
  const didMount = useRef(false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const me = useSelector((state: RootState) => state.user.me);
  const loginError = useSelector((state: RootState) => state.user.loginError);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (me) {
      router.push('/');
    }
  }, [router, me]);

  useEffect(() => {
    if (didMount.current) {
      if (loginError) return alert(loginError);
    } else {
      didMount.current = true;
    }
  }, [loginError]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!id) {
        return alert('아이디를 입력해주세요');
      }
      if (!password) {
        return alert('비밀번호를 입력해주세요');
      }
      const data = {
        id,
        password,
        autoLoginChecked: checkboxRef.current?.checked,
      };
      dispatch(login(data));
    },
    [id, password, dispatch],
  );

  const onChangeId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const onClickSignUp = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    router.push('/signup');
  }, []);

  if (me) {
    return null;
  }
  return (
    <HomeLayout>
      <div className='myform'>
        <div className='logo'>PLEASE LOG IN!</div>
        <form onSubmit={onSubmit}>
          <input className='id_input' type='text' placeholder='&#xf003;   Id' value={id} onChange={onChangeId} />
          <input
            className='password_input'
            type='password'
            placeholder=' &#xf023;  Password'
            value={password}
            onChange={onChangePassword}
          />
          <div className='auto_login_wrapper'>
            <input type='checkbox' name='autoLogin' id='autoLogin' ref={checkboxRef} />
            <label htmlFor='grade-chk1' style={{ color: 'white' }}>
              로그인 유지
            </label>
          </div>
          <button type='submit'>LOG IN </button>
          <div>
            {' '}
            <button type='button' onClick={onClickSignUp}>
              sign up
            </button>{' '}
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Login;
