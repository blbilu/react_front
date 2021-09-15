import React, { useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBInput } from 'mdbreact';
import {login,register,loginWithJWT, getJWT} from '../../service/auth';
import {useHistory, Redirect} from 'react-router-dom';
import Joi from "joi-browser";
import { toast } from "react-toastify";

const schemaLogin = {
  email: Joi.string().required().label("Email"),
  password: Joi.string().required().label("Password"),
};

const schemaRegister = {
    name: Joi.string().required().min(5).max(50).label("Name"),
    email: Joi.string()
    .required()
    .min(5)
    .max(255)
    .email({ minDomainAtoms: 2 })
    .label("Email"),
    password:Joi.string().required().min(5).max(255), 
};

const LoginForm = () => {
  const history = useHistory();
  const [state,setState] = useState({
    isLogin : true,
    form : {
      email : '',
      password : '',
      name : ''
    }
  })

  //change handler
  const changeHandler = e =>{
    const {name,value} = e.target;
    setState(prev=>({
      ...prev,
      form : {
        ...prev.form,
        [name] : value
      }
    }))
  }

  //auth mode change
  const switchMode = ()=>{
    setState(prev=>({
      ...prev,
      isLogin : !prev.isLogin
    }))
  };

  //validation
  const validate = () => {
    const options = {
      abortEarly: false,
    };

    let errorLog ={};
    
    if (state.isLogin) {
      const { error } = Joi.validate({email:state.form.email, password:state.form.password}, schemaLogin, options);
      errorLog = error;
    }else {
      const { error } = Joi.validate(state.form, schemaRegister, options);
      errorLog = error;
    }
    
    if (!errorLog) return null;
    
    const errors = {};
    for (let item of errorLog.details) errors[item.path[0]] = item.message;
      return errors;
  };

  //form submit form
  const submitForm =async e =>{
    e.preventDefault();
    
    const errors = validate();

    if(state.isLogin){
      if (errors) {
        toast.error("Your credentials are not correct, please try again.");
        return false;
      }
      login(state.form.email,state.form.password).then(res=>{
        if(res === true){
            history.push('/Home')
        }else{
          toast.error('Please check the credentials')
        }
      })
    }else{
      
      if (errors) {
        toast.error(Object.values(errors).join(", "));
        return false;
      }
      const response = await register(state.form);
      loginWithJWT(response.headers['x-auth-token']);
      history.push('/Home')
    }
  }

  if (getJWT()) {
    return <Redirect exact to="/Home" />;
  }

  return (
    <MDBContainer>
      <MDBRow className="login-box">
        <MDBCol md='6'>
          <MDBCard
            className='card-image'
            style={{
              backgroundImage:
                'url(https://mdbcdn.b-cdn.net/img/Photos/Others/pricing-table7.jpg)',
              backgroundSize: '100%'
            }}
          >
            <div className='text-white rgba-stylish-strong py-5 px-5 z-depth-4'>
              <div className='text-center'>
                <h3 className='white-text mb-5 mt-4 font-weight-bold'>
                  <strong>{!state.isLogin ? 'SIGN' : 'LOG'}</strong>
                  <a href='#!' className='green-text font-weight-bold'>
                    <strong> {!state.isLogin ? 'UP' : 'IN'}</strong>
                  </a>
                </h3>
              </div>
              <form onSubmit={submitForm}>

              {
                !state.isLogin&&
                <MDBInput
                label='Your name'
                group
                type='text'
                validate
                labelClass='white-text'
                name="name"
                onChange={changeHandler}
                />
              }
              <MDBInput
                label='Your email'
                group
                type='text'
                validate
                labelClass='white-text'
                name="email"
                onChange={changeHandler}
                />
              <MDBInput
                label='Your password'
                group
                type='password'
                validate
                labelClass='white-text'
                name="password"
                onChange={changeHandler}
                />
              <MDBRow className='d-flex align-items-center mb-4'>
                <div className='text-center mb-3 col-md-12'>
                  <button className="btn btn-success btn-block btn-rounded z-depth-1 waves-effect waves-light">{!state.isLogin ? 'sign up' : 'log in'}</button>
                  {/* <MDBBtn
                    color='success'
                    rounded
                    type='button'
                    className='btn-block z-depth-1'
                    >
                    Sign in
                  </MDBBtn> */}
                  {/* <MDBBtn color="blue"></MDBBtn> */}
                </div>
              </MDBRow>
                  </form>
              <MDBCol md='12'>
                <p className='font-small white-text d-flex justify-content-end'>
                {
                  !state.isLogin?
                  'Have an account?':
                  'Create new Account'
                }
                  
                  <span className='green-text ml-1 font-weight-bold' style={{"cursor":"pointer"}}>
                    {
                      !state.isLogin?
                      <span onClick={switchMode}>Log in</span> :
                      <span onClick={switchMode}>Sign Up</span>
                    }
                  </span>
                </p>
              </MDBCol>
            </div>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default LoginForm;