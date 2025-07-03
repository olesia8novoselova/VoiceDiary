import { useEffect } from "react";
import { useGetMeQuery } from "./authApi";
import { useDispatch } from "react-redux";
import { setCredentials, setError } from "./authSlice";

const InitializeAuth = () => {
  const { data, error } = useGetMeQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(setError('Session initialization failed'));
    }
    if (data) {
      dispatch(setCredentials({ user: data, token: 'existing' }));
    }
  }, [data, error, dispatch]);

  return null;
};

export default InitializeAuth;
