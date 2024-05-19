import { SyntheticEvent, useState, useEffect } from 'react';

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
  const [passwordCahnged, setPasswordChanged] = useState<boolean>(false);

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
    await fetch('/newpassword', {
      method: "POST",
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
          setPasswordChanged(true);
        }
        else if (res.status === 'failed') {
          setErrHasAccount(res.message);
          setErr([]);
        }
        else if (res.status !== 'error') {
          setErr(res.errors.errors);
          setErrHasAccount('');
        }
      });
  };

  return (
    <main className='sign-container'>
      <div className='form-container'>
        <h2>New password</h2>
        {err.length !== 0 &&
          <div className='error'>{err.map((r: msg) => <div>{r.msg}</div>)}</div>
        }

        {errHasAccount !== '' &&
          <div className='error'>
            <div>{errHasAccount}</div>
          </div>
        }

        {passwordCahnged &&
          <div className='.sumbit-ok'>
            <div>Password changed</div>
          </div>
        }

        <form action="/" method='Post' onSubmit={handleSubmit}>
          <label className='password-container'>
            <input type={password1} placeholder='Password' required tabIndex={0} name='password' onChange={handleInputChange} value={inputValue.password} />
          </label>

          <label className='password-container'>
            <input type={password1} placeholder='Re-enter password' name='password2' required tabIndex={0} onChange={handleInputChange} value={inputValue.password2} />
          </label>

          <label className='checkbox-container'>
            <input type="checkbox" tabIndex={0} onChange={() => setShowPassword(!showPassword)} />
            Show password
          </label>

          <input type="submit" value="Send" className='submit' tabIndex={3} />
        </form>
      </div>
    </main>
  )
}
