import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../auth";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export function useAuth() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate("/my-portfolio");
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate("/my-portfolio");
    },
  });

  return {
    loginMutation,
    signupMutation,
  };
} 