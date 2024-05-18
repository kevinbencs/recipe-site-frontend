import { SyntheticEvent } from 'react';


export default function Forgotpassword() {
  const handleSzbmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <main className='sign-container'>
      <div className='form-container'>
        <h2>Password assistance</h2>
        <p>
          Enter the email address associated with your account.
        </p>
        <form action="/" method='Post' onSubmit={handleSzbmit}>
          <label className='email-conatiner'>
            <input type="email" placeholder='Email' required tabIndex={0} />
          </label>
          <input type="submit" value="Send" className='submit' tabIndex={0} />
        </form>
      </div>
    </main>
  )
}
