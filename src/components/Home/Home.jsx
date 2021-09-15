import React, { useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBContainer,
  MDBRow,
  MDBIcon,
  MDBCol,
} from "mdbreact";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Layout from "./Layout";
import {
  addEmployee,
  getEpmployee,
  editEmployee,
  deleteEmployee,
  searchEmployee,
} from "../../service/employee";
import http from "../../service/http";

const schema = {
  name: Joi.string().required().min(5).max(50).label("Name"),
  email: Joi.string()
    .required()
    .min(5)
    .max(255)
    .email({ minDomainAtoms: 2 })
    .label("Email"),
  age: Joi.number().required().min(1).max(150).label("Age"),
  address: Joi.string().required().min(5).max(255).label("Address"),
  mobile: Joi.number().required().label("Mobile"),
};

export default function Basic() {
  const history = useHistory();
  const [state, setState] = React.useState({
    modal: {
      show: false,
      title: "",
    },
    employeeId: "",
    form: {
      name: "",
      age: "",
      mobile: "",
      address: "",
      email: "",
    },
    data: [],
  });

  useEffect(() => {
    loadData();
  }, []);
  const loadData = () => {
    getEpmployee().then((res) => {
      setState((prev) => ({
        ...prev,
        data: res,
      }));
    });
  };
  const toggle = (type = "", id = "") => {
    if (type === "Edit" && id) {
      const employee = state.data.find((item) => item.id === id);
      setState((prev) => ({
        ...prev,
        form: {
          name: employee.name,
          age: employee.age,
          mobile: employee.phone,
          address: employee.address,
          email: employee.email,
        },
        employeeId: employee._id,
      }));
    }
    if (state.modal.show) {
      setState((prev) => ({
        ...prev,
        form: {
          name: "",
          age: "",
          mobile: "",
          address: "",
          email: "",
        },
      }));
    }
    setState((prev) => ({
      ...prev,
      modal: {
        ...prev,
        show: !prev.modal.show,
        title: type,
      },
    }));
  };

  //change handler
  const changeHandler = (e) => {
    const { name, value } = e.target;
    
    setState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: value,
      },
    }));
  };

  const validate = () => {
    const options = {
      abortEarly: false,
    };
    const { error } = Joi.validate(state.form, schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  //form submission
  const submitForm = (e) => {
    e.preventDefault();

    const errors = validate();

    if (errors) {
      toast.error(Object.values(errors).join(", "));
      return false;
    }

    if (state.modal.title === "Edit") {
      handleEdit(state.form, state.employeeId);
    } else {
      handleAdd(state.form);
    }
  };

  //Add handler
  const handleAdd = async (employee) => {
    try {
      const user = await addEmployee(employee);
      setState((prev) => ({
        ...prev,
        data: [user, ...prev.data],
        modal: {
          ...prev.modal,
          show: false,
        },
      }));
      loadData();
      history.push("/Home");
    } catch (err) {
      toast.error("Invalid Rquest");
    }
  };

  //Edit handle
  const handleEdit = async (employee, employeeId) => {
    try {
      const user = await editEmployee(employee, employeeId);
      setState((prev) => ({
        ...prev,
        form: {},
        modal: {
          ...prev.modal,
          show: false,
        },
      }));
      loadData();
    } catch (err) {
      toast.error("Invalid Employee");
    }
  };

  //Delete handler
  const handleDelete = async (post) => {
    const originalPosts = state.data;

    const newPosts = state.data.filter((p) => p.id !== post.id);

    setState((prev) => ({
      ...prev,
      data: newPosts,
    }));

    try {
      const user = await deleteEmployee(post._id);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        data: originalPosts,
      }));
    }
  };

  //search
  const search = (e) => {
    const { value } = e.target;
    searchEmployee(value).then((res) => {
      setState(prev=>({
        ...prev,
        data : res
      }))
    });
  };

  return (
    <div>
      <Layout />
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-6">
            <form className="form-inline md-form form-sm mt-0">
              <i className="fa fa-search active" aria-hidden="true"></i>
              <input
                className="form-control form-control-sm ml-3 w-75"
                type="text"
                placeholder="Search"
                aria-label="Search"
                name="search"
                onChange={search}
              />
            </form>
          </div>
          <div className="col-sm-6">
            <div
              className="row h-auto pr-2 float-right"
              data-toggle="tooltip"
              data-placement="right"
              title="Add Employee"
            >
              <span className="table-add float-right mb-3 mr-2">
                <span className="text-success" onClick={() => toggle("Add")}>
                  <i className="fas fa-plus fa-2x" aria-hidden="true"></i>
                </span>
              </span>
            </div>
          </div>
        </div>

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th className="">#</th>
              <th className="">Employee Id</th>
              <th className="">Name</th>
              <th className="">Email ID</th>
              <th className="">Mobile</th>
              <th className="">Age</th>
              <th className="">Address</th>
              <th className="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              state.data.length ===0?
              <tr>
                <td colSpan="8" align="center">No Employees Found</td>
              </tr>
              :
            state.data.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item.id}</td>
                <td className="">{item.name}</td>
                <td className="text-center">{item.email}</td>
                <td className="text-center">{item.phone}</td>
                <td className="text-center">{item.age}</td>
                <td className="text-center">{item.address}</td>
                <td className="btn__p0">
                  <button
                    className="btn btn-sm btn-info btn-rounded"
                    data-toggle="modal"
                    data-target="#myModal"
                    onClick={() => toggle("Edit", item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger btn-rounded"
                    data-toggle="modal"
                    data-target="#myModal"
                    onClick={() => handleDelete(item)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <MDBModal isOpen={state.modal.show} toggle={() => toggle()}>
          <form onSubmit={submitForm}>
            <MDBModalHeader className="text-center" toggle={() => toggle()}>
              {state.modal.title} Employee
            </MDBModalHeader>
            <MDBModalBody>
              <MDBContainer>
                <MDBRow>
                  <MDBCol md="12">
                    <label htmlFor="name" className="grey-text">
                      Name <span style="color: red">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      name="name"
                      onChange={changeHandler}
                      value={state.form.name}
                    />
                    <br />
                    <label htmlFor="emailid" className="grey-text">
                      Email ID <span style="color: red">*</span>
                    </label>
                    <input
                      type="email"
                      id="emailid"
                      className="form-control"
                      name="email"
                      onChange={changeHandler}
                      value={state.form.email}
                    />
                    <br />
                    <label htmlFor="age" className="grey-text">
                      Age <span style="color: red">*</span>
                    </label>
                    <input
                      type="text"
                      id="age"
                      className="form-control"
                      name="age"
                      onChange={changeHandler}
                      value={state.form.age}
                    />
                    <br />
                    <label htmlFor="mobile" className="grey-text">
                      Mobile <span style="color: red">*</span>
                    </label>
                    <input
                      type="text"
                      id="mobile"
                      className="form-control"
                      name="mobile"
                      onChange={changeHandler}
                      value={state.form.mobile}
                    />
                    <br />
                    <label htmlFor="address" className="grey-text">
                      Address <span style="color: red">*</span>
                    </label>
                    <textarea
                      type="text"
                      id="address"
                      className="form-control"
                      rows="3"
                      name="address"
                      onChange={changeHandler}
                      value={state.form.address}
                    />
                    <div className="text-center mt-4">
                      {/* <MDBBtn color="warning" outline type="submit">
                              Send
                              <MDBIcon far icon="paper-plane" className="ml-2" />
                            </MDBBtn> */}
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBModalBody>
            <MDBModalFooter>
              <button className="btn btn-success" type="submit">
                {state.modal.title}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => toggle()}
              >
                cancel
              </button>
            </MDBModalFooter>
          </form>
        </MDBModal>
      </div>
    </div>
  );
}
