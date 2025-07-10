import { useEffect } from "react";
import { useGetMeQuery } from "./authApi";
import { useDispatch } from "react-redux";
import { setCredentials, logout } from "./authSlice";

const InitializeAuth = () => {
  const { data, error } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data }));
    } else if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  return null;
};

export default InitializeAuth;