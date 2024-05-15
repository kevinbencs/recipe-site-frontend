import { SyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
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
        <h2>Sign up</h2>
        <form action="/" method='Post' onSubmit={handleSubmit}>
          <label className='email-conatiner'>
            <input type="email" placeholder='Email' required tabIndex={0} />
          </label>
          <label className='password-container'>
            <input type={password1} placeholder='Password' required tabIndex={0} />
          </label>
          <label className='password-container'>
            <input type={password1} placeholder='Re-enter password' required tabIndex={0} />
          </label>

          <label className='checkbox-container'>
            <input type="checkbox"  tabIndex={0} onChange={() => setShowPassword(!showPassword)}/>
            Show password
          </label>

          <label className='checkbox-container'>
            <input type="checkbox" required tabIndex={0} />
            Privacy notice
            <abbr className="required" title="required">*</abbr>
          </label>
          <span className='checkbox-description'>
            By creating an account, you agree to <Link to='/terms' tabIndex={0}>privacy notice</Link>.
          </span>

          <label className='checkbox-container'>
            <input type="checkbox" tabIndex={0} />
            Newsletter
          </label>
          <span className='checkbox-description'>
            Sign up for the newsletter.
          </span>
          <input type="submit" value='Sign up' className='submit' tabIndex={0} />
        </form>
        <div className='signin-signun-forgotpassword'>
          Already have an account? <Link to='/signin' tabIndex={0}>Sign in. </Link>
        </div>

      </div>
    </main>

  )
}
