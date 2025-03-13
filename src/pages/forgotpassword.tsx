import { SyntheticEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTransition } from 'react';
import { json } from 'stream/consumers';


export default function Forgotpassword() {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [err, setErr] = useState<string>('')
  const [errHasAccount, setErrHasAccount] = useState<string[]>([]);

  const handleSzbmit = (e: SyntheticEvent) => {
    e.preventDefault();
    startTransition(() => {
      fetch('/api/forgotpassword',{
        method: 'POST',
        headers: {
          "Accept": "application/json, text/plain",
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({email})
      })
      .then(data => data.json())
      .then(res => {
        if(res.failed) setErrHasAccount(res.failed);
        else if(res.success) setMessage(res.success);
        else if(res.error) setErr(res.error);
      })
      .catch(err => {
        console.error(err);
        setErr('Something went wrong. Please try again')
      })
    })
  };

  return (
    <>
      <Helmet>
        <title>Forgot password - Recipes</title>
        <meta property="og:title" content=" Forgot password - Recipes" />
        <meta name="description" content='Forgot password page' />
        <meta name='keywords' content='recipe, forgot password' />
        <meta property="og:description" content='Forgot password page' />
        <meta property='og:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta property='og:image:alt' content='Recipe page image' />
        <meta name="twitter:creator" content='Admin' />
        <meta name="twitter:title" content='Forgot password - Recipes' />
        <meta name="twitter:description" content='Forgot password page' />
        <meta name='twitter:image' content='/static/media/search_background2.4ae55a27295ea43cc745.jpg' />
        <meta name='twitter:image:alt' content='Recipe page image' />
        <meta name="robots" content="index, follow, noimageindex"></meta>
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:0, max-image-preview:large"></meta>
      </Helmet>
      <main className='sign-container'>
        <div className='form-container'>
          <h1>Password assistance</h1>
          
          <p>
            Enter the email address associated with your account.
          </p>
          <form action="/" method='Post' onSubmit={handleSzbmit}>
            <label className='email-conatiner'>
              <input type="email" disabled={isPending} placeholder='Email' required tabIndex={0} value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <input type="submit" disabled={isPending} value="Send" className='submit' tabIndex={0} />
          </form>
          <div className='submit-ok'>{message}</div>
          {err !== '' &&
            <div className='error'>{err}</div>
          }

          {errHasAccount.length !== 0 &&
            <div className='error'>
              {errHasAccount.map((mes: string) => <div>{mes}</div>)}
            </div>
          }
        </div>
      </main>
    </>
  )
}
