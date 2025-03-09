import { SyntheticEvent, useState, useEffect } from 'react';
import { useTransition } from 'react';
import { Helmet } from 'react-helmet-async';

interface FormValue {
  password: string,
  password2: string
};

interface msg {
  msg: string,

}

export default function Newpassword() {
  const [password1, setPassword1] = useState<string>('password');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<FormValue>({ password: '', password2: '' });
  const [err, setErr] = useState<msg[]>([]);
  const [errHasAccount, setErrHasAccount] = useState<string>('');
  const [passwordCahnged, setPasswordChanged] = useState<string>('');
  const [isPending, startTransition] = useTransition()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    if (showPassword) {
      setPassword1('text');
    }
    else {
      setPassword1('password');
    }
  }, [showPassword]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    startTransition(() => {
      fetch('/newpassword', {
        method: "PATCH",
        headers: {
          "Accept": "application/json, text/plain",
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        credentials: 'include',
        body: JSON.stringify(inputValue),
      })
        .then(data => data.json())
        .then(res => {
          if (res.status === 'success') {
            setErr([]);
            setErrHasAccount('');
            setInputValue({ password: '', password2: '' });
            setPasswordChanged(res.message);
          }
          else if (res.status === 'failed') {
            setErrHasAccount(res.message);
            setErr([]);
            setPasswordChanged('');
          }
          else if (res.status !== 'error') {
            setErr(res.errors.errors);
            setErrHasAccount('');
            setPasswordChanged('');
          }
        })
        .catch(err => {
          console.error(err)
        })
    })

  };

  return (
    <>
    
      <Helmet>
        <title>New password</title>
        <meta name="description" content={`New password page`} />
        <meta name='keywords' content='New password'/>
        <meta property="og:description" content={``} />
        <meta property='og:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta property='og:image:alt' content='Recipe page image' />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content={``} />
        <meta name="twitter:description" content={``} />
        <meta name='twitter:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta name='twitter:image:alt' content='Recipe page image' />
        <meta name="robots" content="noindex, nofollow, noimageindex"></meta>
        <meta name="googlebot" content="noindex, nofollow, noimageindex, max-video-preview:0, max-image-preview:large"></meta>
      </Helmet>
    
    <main className='sign-container'>
      <div className='form-container'>
        <h1>New password</h1>
        {err.length !== 0 &&
          <div className='error'>{err.map((r: msg) => <div>{r.msg}</div>)}</div>
        }

        {errHasAccount !== '' &&
          <div className='error'>
            <div>{errHasAccount}</div>
          </div>
        }

        {passwordCahnged !== '' &&
          <div className='submit-ok'>
            <div>Password changed</div>
          </div>
        }

        <form action="/" method='Post' onSubmit={handleSubmit}>
          <label className='password-container'>
            <input type={password1} disabled={isPending} placeholder='Password' required tabIndex={0} name='password' onChange={handleInputChange} value={inputValue.password} />
          </label>

          <label className='password-container'>
            <input type={password1} disabled={isPending} placeholder='Re-enter password' name='password2' required tabIndex={0} onChange={handleInputChange} value={inputValue.password2} />
          </label>

          <label className='checkbox-container'>
            <input type="checkbox" disabled={isPending} tabIndex={0} onChange={() => setShowPassword(!showPassword)} />
            Show password
          </label>

          <input type="submit" value="Send" className='submit' tabIndex={3} />
        </form>
      </div>
    </main>
    </>
  )
}
