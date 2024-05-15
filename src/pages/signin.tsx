import { SyntheticEvent, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Signin() {
  const [password1, setPassword1] = useState<string>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  useEffect(() => {
    if(showPassword){
      setPassword1('text');
    }
    else{
      setPassword1('password');
    }
  },[showPassword]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <main className='sign-container'>
      <div className='form-container'>
        <h2>Sign in</h2>
        <form action="/" method='Post' onSubmit={handleSubmit}>
          <label className='email-conatiner'>
            <input type="email" placeholder='Email' required tabIndex={1} />
          </label>

          <label className='password-container'>
            <input type={password1} placeholder='Password' required tabIndex={2} />
          </label>

          <label className='checkbox-container'>
            <input type="checkbox"  tabIndex={0} onChange={() => setShowPassword(!showPassword)}/>
            Show password
          </label>

          <input type="submit" value="Sign in" className='submit' tabIndex={3} />
        </form>
        <div className='signin-signun-forgotpassword'>
          Forgot your password? <Link to='/forgotpassword' tabIndex={4}>Click here. </Link>
        </div>
        <div className='signin-signun-forgotpassword'>
          Don't you have an account? <Link to='/signup' tabIndex={5}>Sign up. </Link>
        </div>
      </div>
    </main>
  )
}
