import { SyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


interface FormValue {
  name: string,
  email: string,
  password: string,
  password2: string,
  newsletter: boolean,
  term: boolean
};

interface msg{
  msg: string,

}

export default function Signup() {
  const [password1, setPassword1] = useState<string>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signUpValue, setSignUpValue] = useState<FormValue>({
    name: '', email: '', password: '', password2: '', newsletter: false, term: false
  });
  const [err, setErr] =useState<msg[]>([]);
  const [errHasAccount, setErrHasAccount] = useState<string>('');

  useEffect(() => {
    if (showPassword) {
      setPassword1('text');
    }
    else {
      setPassword1('password');
    }
  }, [showPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value , checked} = e.target;
    if(name === 'term' || name === 'newsletter'){
      setSignUpValue({ ...signUpValue, [name]: checked });
    }
    else{
      setSignUpValue({ ...signUpValue, [name]: value });
    }
    
  };


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await fetch('/signup', {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json"
      },
      body: JSON.stringify(signUpValue),
    })
    .then(data => data.json())
    .then(res => {
      if(res.status === 'success'){
        setSignUpValue({ name: '', email: '', password: '', password2: '', newsletter: false, term: false});
        setErr([]);
        setErrHasAccount('');
      }
      else if (res.status === 'failed'){
        setErrHasAccount(res.message);
        setErr([]);
      }
      else if(res.status !== 'error'){
        setErr(res.errors.errors);
        setErrHasAccount('');
      }
    }
  )
      
    
  };

  return (
    <main className='sign-container'>
      <div className='form-container'>
       
        <h2>Sign up</h2>
        {err.length !== 0 &&
          <div className='error'>{err.map((r: msg) => <div>{r.msg}</div>)}</div>
        }
        
        {errHasAccount !== '' && 
          <div className='error'>
            <div>{errHasAccount}</div>
          </div>
        }
        
        <form action="/" method='Post' onSubmit={handleSubmit}>
          <label className='name-conatiner'>
            <input type="text" placeholder='Name' name='name' required tabIndex={0} onChange={handleInputChange} value={signUpValue.name} />
          </label>
          <label className='email-conatiner'>
            <input type="email" placeholder='Email' name='email' required tabIndex={0} onChange={handleInputChange} value={signUpValue.email}/>
          </label>
          <label className='password-container'>
            <input type={password1} placeholder='Password' name='password' required tabIndex={0} onChange={handleInputChange} value={signUpValue.password}/>
          </label>
          <label className='password-container'>
            <input type={password1} placeholder='Re-enter password' name='password2' required tabIndex={0} onChange={handleInputChange} value={signUpValue.password2}/>
          </label>

          <label className='checkbox-container'>
            <input type="checkbox" tabIndex={0} onChange={() => setShowPassword(!showPassword)} />
            Show password
          </label>

          <label className='checkbox-container'>
            <input type="checkbox" required tabIndex={0} name='term' onChange={handleInputChange} checked={signUpValue.term}/>
            Privacy notice
            <abbr className="required" title="required">*</abbr>
          </label>
          <span className='checkbox-description'>
            By creating an account, you agree to <Link to='/terms' tabIndex={0}>privacy notice</Link>.
          </span>

          <label className='checkbox-container'>
            <input type="checkbox" tabIndex={0} name={'newsletter'} onChange={handleInputChange} checked={signUpValue.newsletter}/>
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
