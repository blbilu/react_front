import jwtDecode from "jwt-decode";
import { useContext } from "react";
import authContext from '../store/auth-context';

import http from './http';

setTimeout(() => {  
  http.setJWT(getJWT());
}, 1000);

export async function login(email, password) {
    // const logUser = useContext(authContext);

  try {  
    const { data: token } = await http.post('/auth  ', { email, password });
    // store.commit("setToken", token);
    const {user} = jwtDecode(token);
    localStorage.setItem('setToken',token)
    return true;
  }
  catch (err) {
    return ;
  }
}

export function loginWithJWT(token) {
    localStorage.setItem('setToken',token)
    // store.commit("setToken", token);
}

export function logout() {
    localStorage.removeItem('setToken')
    // store.commit("removeToken");
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem('setToken');
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export function getJWT() {
  return localStorage.getItem('setToken');
}
export function register(data){
    return http.post("/users", data);
}
export function getUsername(){
    const {name} = jwtDecode(getJWT());
    return name; 
}
export default {
  login,
  loginWithJWT,
  logout,
  getCurrentUser,
  getJWT,
  register
};