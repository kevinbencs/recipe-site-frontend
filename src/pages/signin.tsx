import { SyntheticEvent, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormValueSignIn } from '../types/apitype';


type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function Signin(props:{setAccount: Dispatcher<string>}) {
  const [password1, setPassword1] = useState<string>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInValue, setSignInValue ] = useState<FormValueSignIn>({email: '', password: ''});
  const [err, setErr] =useState<string[]>([]);
  const [errHasAccount, setErrHasAccount] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInValue({ ...signInValue, [name]: value });
  };

  useEffect(() => {
    if(showPassword){
      setPassword1('text');
    }
    else{
      setPassword1('password');
    }
  },[showPassword]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await fetch('/signin',{
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: 'include',
      body: JSON.stringify(signInValue),
    })
      .then(data => data.json())
      .then(res => {
        if(res.status === 'success'){
          setErr([]);
          setErrHasAccount([]);
          props.setAccount(res.data);
          navigate('/');
        }
        else if (res.status === 'failed'){
          setErrHasAccount(res.message);
          setErr([]);
        }
        else if(res.status !== 'error'){
          setErr(res.errors.errors);
          setErrHasAccount([]);
        }
      });
  };

  return (
    <main className='sign-container'>
      <div className='form-container'>
        <h2>Sign in</h2>
        {err.length !== 0 &&
          <div className='error'>{err.map((mes: string) => <div>{mes}</div>)}</div>
        }
        
        {errHasAccount.length !== 0 && 
          <div className='error'>
            {errHasAccount.map((mes:string) => <div>{mes}</div>)}
          </div>
        }
        <form action="/" method='Post' onSubmit={handleSubmit}>
          <label className='email-conatiner'>
            <input type="email" placeholder='Email' required tabIndex={0} name='email' onChange={handleInputChange} />
          </label>

          <label className='password-container'>
            <input type={password1} placeholder='Password' required tabIndex={0} name='password' onChange={handleInputChange} />
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
