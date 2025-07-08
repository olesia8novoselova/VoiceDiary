import { useEffect } from "react";
import { useGetMeQuery } from "./authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

const InitializeAuth = () => {
  const { data } = useGetMeQuery(undefined, {
    retry: false,
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data, token: 'existing' }));
    }
  }, [data, dispatch]);

  return null;
};

export default InitializeAuth;