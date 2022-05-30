import axios from '../api/axios';
import useAuth from './useAuth';

function useRefreshToken() {
  const { setAuth, auth } = useAuth();

  const refresh = async () => {
    console.log('useRefreshToken', auth);
    const { data } = await axios.get('/refresh', {
      withCredentials: true
    });
    setAuth((prevState) => {
      console.log(JSON.stringify(prevState));
      console.log(data.accessToken);
      return {
        ...prevState,
        accessToken: data.accessToken
      };
    });
    return data.accessToken;
  };

  return refresh;
}

export default useRefreshToken;
