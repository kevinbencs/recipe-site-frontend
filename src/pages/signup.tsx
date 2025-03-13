import { SyntheticEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormValue } from '../types/apitype';
import { useTransition } from 'react';
import { Helmet } from 'react-helmet-async';


export default function Signup() {
  const [password1, setPassword1] = useState<string>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signUpValue, setSignUpValue] = useState<FormValue>({
    name: '', email: '', password: '', password2: '', newsletter: false, term: false
  });
  const [err, setErr] = useState<string>('');
  const [errHasAccount, setErrHasAccount] = useState<string[]>([]);
  const [submitOk, setSubmitOk] = useState<string>('');
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (showPassword) {
      setPassword1('text');
    }
    else {
      setPassword1('password');
    }
  }, [showPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === 'term' || name === 'newsletter') {
      setSignUpValue({ ...signUpValue, [name]: checked });
    }
    else {
      setSignUpValue({ ...signUpValue, [name]: value });
    }

  };


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    startTransition(() => {
      fetch('/signup', {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain",
          "Content-type": "application/json"
        },
        body: JSON.stringify(signUpValue),
      })
        .then(data => data.json())
        .then(res => {
          if (res.success) {
            setSignUpValue({ name: '', email: '', password: '', password2: '', newsletter: false, term: false });
            setErr('');
            setErrHasAccount([]);
            setSubmitOk(res.success);

          }
          else if (res.failed) {
            setErrHasAccount(res.failed);
            setErr('');
            setSubmitOk('');
          }
          else if (res.error) {
            setErr(res.error);
            setErrHasAccount([]);
            setSubmitOk('');
          }
        }
        )
        .catch((error) => {
          console.error(error)
          setErr('Something went wrong. Please try again')
        })
    })




  };

  return (
    <>
      <Helmet>
        <title>Sing up - Recipes</title>
        <meta property="og:title" content=" Sing up - Recipes" />
        <meta name="description" content='Sing up page' />
        <meta name='keywords' content='recipe, sing up' />
        <meta property="og:description" content='Sign up page' />
        <meta property='og:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta property='og:image:alt' content='Recipe page image' />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content='Sing up - Recipes' />
        <meta name="twitter:description" content='Sing up page' />
        <meta name='twitter:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta name='twitter:image:alt' content='Recipe page image' />
        <meta name="robots" content="index, follow, noimageindex"></meta>
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:0, max-image-preview:large"></meta>
      </Helmet>
      <main className='sign-container'>
        <div className='form-container'>

          <h1>Sign up</h1>
          {err !== '' &&
            <div className='error'>{err}</div>
          }

          {errHasAccount.length !== 0 &&
            <div className='error'>
              {errHasAccount.map((r: string) => <div>{r}</div>)}
            </div>
          }

          {submitOk !== '' &&
            <div className='submit-ok'>
              <div>{submitOk}</div>
            </div>
          }

          <form action="/" method='Post' onSubmit={handleSubmit}>
            <label className='name-conatiner'>
              <input type="text" placeholder='Name' disabled={isPending} name='name' required tabIndex={0} onChange={handleInputChange} value={signUpValue.name} />
            </label>
            <label className='email-conatiner'>
              <input type="email" placeholder='Email' disabled={isPending} name='email' required tabIndex={0} onChange={handleInputChange} value={signUpValue.email} />
            </label>
            <label className='password-container'>
              <input type={password1} placeholder='Password' disabled={isPending} name='password' required tabIndex={0} onChange={handleInputChange} value={signUpValue.password} />
            </label>
            <label className='password-container'>
              <input type={password1} placeholder='Re-enter password' disabled={isPending} name='password2' required tabIndex={0} onChange={handleInputChange} value={signUpValue.password2} />
            </label>

            <label className='checkbox-container'>
              <input type="checkbox" disabled={isPending} tabIndex={0} onChange={() => setShowPassword(!showPassword)} />
              Show password
            </label>

            <label className='checkbox-container'>
              <input type="checkbox" disabled={isPending} required tabIndex={0} name='term' onChange={handleInputChange} checked={signUpValue.term} />
              Privacy notice
              <abbr className="required" title="required">*</abbr>
            </label>
            <span className='checkbox-description'>
              By creating an account, you agree to <Link to='/terms' tabIndex={0}>privacy notice</Link>.
            </span>

            <label className='checkbox-container'>
              <input type="checkbox" disabled={isPending} tabIndex={0} name={'newsletter'} onChange={handleInputChange} checked={signUpValue.newsletter} />
              Newsletter
            </label>
            <span className='checkbox-description'>
              Sign up for the newsletter.
            </span>
            <input type="submit" disabled={isPending} value='Sign up' className='submit' tabIndex={0} />
          </form>
          <div className='signin-signun-forgotpassword'>
            Already have an account? <Link to='/signin' tabIndex={0}>Sign in. </Link>
          </div>

        </div>
      </main>
    </>
  )
}
