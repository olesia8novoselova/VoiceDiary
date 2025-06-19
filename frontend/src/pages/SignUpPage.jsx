import React from "react"; 
import "./SignUpPage.css";

function SignUpPage(){
    return(
        <div className = "login">
            <div className="login-left">
                <h2>Sign in</h2>
                <form className="login-form">
                    <label>Your email</label>
                    <input type = "email" placeholder = "Enter your email"></input>
                    <label>Password</label>
                    <input type = "password" placeholder = "Enter your password"></input>
                    <input type = "password" placeholder = "Repeat your password"></input>
                    <button type = "submit">Sign up</button>
                    
                    
                </form>
           
      </div>
      <div className="login-right" />
            
        </div>
    )
}

export default SignUpPage;