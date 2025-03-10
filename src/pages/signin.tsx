import { SyntheticEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormValueSignIn } from '../types/apitype';
import { useLogged } from '../components/userProvider';
import { useTransition } from 'react';
import { Helmet } from 'react-helmet-async';


export default function Signin() {
  const [password1, setPassword1] = useState<string>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInValue, setSignInValue] = useState<FormValueSignIn>({ email: '', password: '' });
  const [err, setErr] = useState<string>();
  const [errHasAccount, setErrHasAccount] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate();
  const { setName } = useLogged()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInValue({ ...signInValue, [name]: value });
  };

  useEffect(() => {
    if (showPassword) {
      setPassword1('text');
    }
    else {
      setPassword1('password');
    }
  }, [showPassword]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    startTransition(() => {
      fetch('/signin', {
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
          if (res.success) {
            setErr('');
            setErrHasAccount([]);
            setName(res.success);
            navigate('/');
          }
          else if (res.failed) {
            setErrHasAccount(res.failed);
            setErr('');
          }
          else if (res.error) {
            setErr(res.error);
            setErrHasAccount([]);
          }
        })
        .catch((err) => {
          console.error(err)
        });
    })

  };

  return (
    <>
      <Helmet>
        <title>Sing in - Recipes</title>
        <meta property="og:title" content=" Sing in - Recipes" />
        <meta name="description" content='Sing in page' />
        <meta name='keywords' content='recipe, sing in' />
        <meta property="og:description" content='Recipe page' />
        <meta property='og:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta property='og:image:alt' content='Recipe page image' />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content='Sing in - Recipes' />
        <meta name="twitter:description" content='Sing in page' />
        <meta name='twitter:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta name='twitter:image:alt' content='Recipe page image' />
        <meta name="robots" content="index, follow, noimageindex"></meta>
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:0, max-image-preview:large"></meta>
      </Helmet>
      <main className='sign-container'>
        <div className='form-container'>
          <h1>Sign in</h1>
          {err !== '' &&
            <div className='error'>{err}</div>
          }

          {errHasAccount.length !== 0 &&
            <div className='error'>
              {errHasAccount.map((mes: string) => <div>{mes}</div>)}
            </div>
          }
          <form action="/" method='Post' onSubmit={handleSubmit}>
            <label className='email-conatiner'>
              <input type="email" disabled={isPending} placeholder='Email' required tabIndex={0} name='email' onChange={handleInputChange} />
            </label>

            <label className='password-container'>
              <input type={password1} disabled={isPending} placeholder='Password' required tabIndex={0} name='password' onChange={handleInputChange} />
            </label>

            <label className='checkbox-container'>
              <input type="checkbox" disabled={isPending} tabIndex={0} onChange={() => setShowPassword(!showPassword)} />
              Show password
            </label>

            <input type="submit" disabled={isPending} value="Sign in" className='submit' tabIndex={3} />
          </form>
          <div className='signin-signun-forgotpassword'>
            Forgot your password? <Link to='/forgotpassword' tabIndex={4}>Click here. </Link>
          </div>
          <div className='signin-signun-forgotpassword'>
            Don't you have an account? <Link to='/signup' tabIndex={5}>Sign up. </Link>
          </div>
        </div>
      </main>
    </>
  )
}
