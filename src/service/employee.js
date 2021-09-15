import http from "./http";
import { getJWT } from "./auth";

setTimeout(() => {
  http.setJWT(getJWT());
}, 1000);

export async function addEmployee(data) {
  try {
    const { data: employee } = await http.post("/employee", { ...data });
    return employee;
  } catch (err) {
    // return err.response;
    return Promise.reject(err);
  }
}

export async function getEpmployee() {
  http.setJWT(getJWT());
  try {
    const { data: employee } = await http.get("/employee");
    return employee;
  } catch (err) {
    // return err.response;
    return Promise.reject(err);
  }
}

export async function editEmployee(data, id) {
  http.setJWT(getJWT());
  try {
    const { data: employee } = await http.put("/employee/" + id, { ...data });
    return employee;
  } catch (err) {
    // return err.response;
    return Promise.reject(err);
  }
}

export async function deleteEmployee(id) {
  http.setJWT(getJWT());
  try {
    const { data: employee } = await http.delete("/employee/" + id);
    return employee;
  } catch (err) {
    return Promise.reject(err);
  }
}
export async function searchEmployee(keys) {
  http.setJWT(getJWT());
  try {
    const { data: employee } = await http.get("/employee/" + keys);
    return employee;
  } catch (err) {
    return Promise.reject(err);
  }
}
export default {
  addEmployee,
  getEpmployee,
  editEmployee,
  searchEmployee
};
