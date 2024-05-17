import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { signup } from '../../reducers/user';
import { AppDispatch, RootState } from '../../store';

const HomeLayout = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  input {
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

const SignUp = () => {
  const router = useRouter();
  const didMount = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  const signupDone = useSelector((state: RootState) => state.user.signupDone);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (didMount.current) {
      if (signupDone) {
        alert('회원가입 완료');
        router.push('/');
      }
    } else {
      didMount.current = true;
    }
  }, [signupDone, router]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!id) return alert('아이디를 입력해주세요');
      if (!password) return alert('비밀번호를 입력해주세요');
      if (!nickname) return alert('닉네임을 입력해주세요');
      const data = {
        id,
        password,
        nickname,
      };
      dispatch(signup(data));
    },
    [dispatch, id, password, nickname],
  );

  const onChangeId = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const onChangeNickname = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }, []);

  const onClickLogin = useCallback(() => {
    router.push('/login');
  }, []);

  return (
    <HomeLayout>
      <div className='myform'>
        <div className='logo'>PLEASE SIGN UP!</div>
        <form onSubmit={onSubmit}>
          <input type='text' placeholder='&#xf003;   Id' value={id} onChange={onChangeId} />
          <input type='password' placeholder=' &#xf023;  Password' value={password} onChange={onChangePassword} />
          <input type='text' placeholder='&#xf023;  Nickname' value={nickname} onChange={onChangeNickname} />
          <button type='submit'>SIGN UP </button>
          <div>
            {' '}
            <button type='button' onClick={onClickLogin}>
              LOG IN
            </button>{' '}
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default SignUp;
