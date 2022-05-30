import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

const LOGIN_URL = '/auth';

function Login(props) {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }), {
        headers: {
          'Content-Type': 'application/json',
          withCredentials: true
        }
      });
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, pwd, accessToken, roles });
      setUser('');
      setPwd('');
      navigate(from, { replace: true });
    } catch (error) {
      console.log('response', error);
      if (!error?.response) {
        setErrMsg('No server response');
      } else if (error.response?.status === 400) {
        setErrMsg('Missing username or password');
      } else if (error.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login failed');
      }
      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
        {errMsg}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user">Username</label>
        <input
          type="text"
          id="user"
          ref={userRef}
          autoComplete="off"
          required
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <label htmlFor="pwd">Password</label>
        <input
          type="password"
          id="pwd"
          required
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <button type="submit" disabled={!user || !pwd || loading}>
          Sign In
        </button>
      </form>
      <p>
        Need an account?
        <br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
}

export default Login;
