import { Dispatch, SetStateAction, SyntheticEvent, KeyboardEvent, useState } from 'react';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

interface Newsletter{
  name: string,
  email: string,
  meat: boolean,
  vegetable: boolean,
  pasta: boolean,
  side: boolean,
  dessert: boolean,
  seafood: boolean
};

interface msg {
  msg: string,

}

export default function Newsletter(props: { setNewsletterShown: Dispatcher<boolean> }) {

  const [inputValue, setInputValue] = useState<Newsletter>({
    name: '', email: '', meat: false, vegetable: false, pasta: false, side: false, dessert: false, seafood: false
  });
  const [err, setErr] = useState<msg[]>([]);
  const [errHasAccount, setErrHasAccount] = useState<string>('');
  const [submitOk, setSubmitOk] = useState<string>('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === 'term' || name === 'newsletter') {
      setInputValue({ ...inputValue, [name]: checked });
    }
    else {
      setInputValue({ ...inputValue, [name]: value });
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await fetch('/newsletter',{
      method: "POST",
      headers:{
        "Accept": "application/json, text/plain",
        "Content-type": "application/json"
      },
      body: JSON.stringify(inputValue)
    })
    .then(data => data.json())
    .then(res => {
      if (res.status === 'success') {
        setErr([]);
        setErrHasAccount('');
        setSubmitOk(res.message);
        setInputValue({
          name: '', email: '', meat: false, vegetable: false, pasta: false, side: false, dessert: false, seafood: false
        });
        
      }
      else if (res.status === 'failed') {
        setErrHasAccount(res.message);
        setErr([]);
        setSubmitOk('');
      }
      else if (res.status !== 'error') {
        setErr(res.errors.errors);
        setErrHasAccount('');
        setSubmitOk('');
      }
    });
  }

  const newsletterClose = (): void => {
    props.setNewsletterShown(false);
  };

  const handleKeyboardEvent = (e: KeyboardEvent<HTMLLabelElement>): void => {
    if (e.code === 'Enter') {
      newsletterClose();
    }
  }


  return (
    <div className='newsletter-shadow'>
      <div className='newsletter'>
        <div className='newsletter-header'>
          <h2>Newsletter sign up</h2>
          <label tabIndex={0} className='newsletter-close' onClick={newsletterClose} onKeyDown={handleKeyboardEvent}>
            <span></span>
          </label>
        </div>


        <h2 className='main-header'>Recipes</h2>
        <p>Get the latest on recipes and food trends!</p>
        {err.length !== 0 &&
          <div className='error'>{err.map((r: msg) => <div>{r.msg}</div>)}</div>
        }

        {errHasAccount !== '' &&
          <div className='error'>
            <div>{errHasAccount}</div>
          </div>
        }

        {submitOk !== '' &&
          <div className='submit-ok'>
            <div>{submitOk}</div>
          </div>
        }
        <form action="#" method='Post' onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" placeholder="name"  required onChange={handleInputChange} value={inputValue.name}/>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="email"  required onChange={handleInputChange} value={inputValue.email}/>
          <section className='checkbox-container'>
            <h3>Newsletter Subscriptions</h3>
            <div className='checkbox-list'>
              <div>
                <input type="checkbox" name="meat" onChange={handleInputChange} checked={inputValue.meat}/>
                <label htmlFor="meat">Meat</label>
              </div>
              <div>
                <input type="checkbox" name="vegetable" onChange={handleInputChange} checked={inputValue.vegetable}/>
                <label htmlFor="vegetable">Vegetable</label>
              </div>
              <div>
                <input type="checkbox" name="dessert" onChange={handleInputChange} checked={inputValue.dessert}/>
                <label htmlFor="dessert">Dessert</label>
              </div>
              <div>
                <input type="checkbox" name="pasta" onChange={handleInputChange} checked={inputValue.pasta}/>
                <label htmlFor="pasta">Pasta</label>
              </div>
              <div>
                <input type="checkbox" name="seafood" onChange={handleInputChange} checked={inputValue.seafood}/>
                <label htmlFor="seafood">Seafood</label>
              </div>
              <div>
                <input type="checkbox" name="side" className='side' onChange={handleInputChange} checked={inputValue.side}/>
                <label htmlFor="side">Side</label>
              </div>
            </div>

          </section>

          <input type="submit" value="SIGN UP" className='submit-button' />
        </form>
      </div>
    </div>

  )
}
