import React from "react"; 
import "./LoginPage.css";

function LoginPage(){
    return(
        <div className = "login">
            <div className="login-left">
                <h2>Sign in</h2>
                <form className="login-form">
                    <label>Your email</label>
                    <input type = "email" placeholder = "Enter your email"></input>
                    <label>Password</label>
                    <input type = "password" placeholder = "Enter your password"></input>
                    <button type = "submit">Sign in</button>
                </form>
                <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
      <div className="login-right" />
            
        </div>
    )
}

export default LoginPage;