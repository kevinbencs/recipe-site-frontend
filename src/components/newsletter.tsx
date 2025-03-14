import { Dispatch, SetStateAction, SyntheticEvent, KeyboardEvent, useState } from 'react';
import { useTransition } from 'react';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

interface Newsletter {
  name: string,
  email: string,
  meat: boolean,
  vegetarian: boolean,
  pasta: boolean,
  side: boolean,
  dessert: boolean,
  seafood: boolean
};


export default function Newsletter(props: { setNewsletterShown: Dispatcher<boolean> }) {

  const [inputValue, setInputValue] = useState<Newsletter>({
    name: '', email: '', meat: false, vegetarian: false, pasta: false, side: false, dessert: false, seafood: false
  });
  const [err, setErr] = useState<string>('');
  const [errHasAccount, setErrHasAccount] = useState<string>('');
  const [submitOk, setSubmitOk] = useState<string>('');
  const [isPending, startTransition] = useTransition()


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name !== 'name' && name !== 'email') {
      setInputValue({ ...inputValue, [name]: checked });
    }
    else {
      setInputValue({ ...inputValue, [name]: value });
    }
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    startTransition(() => {
      fetch('/newsletter', {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain",
          "Content-type": "application/json"
        },
        body: JSON.stringify(inputValue)
      })
        .then(data => data.json())
        .then(res => {
          if (res.success) {
            setErr('');
            setErrHasAccount('');
            setSubmitOk(res.success);
            setInputValue({
              name: '', email: '', meat: false, vegetarian: false, pasta: false, side: false, dessert: false, seafood: false
            });

          }
          else if (res.failed) {
            setErrHasAccount(res.failed);
            setErr('');
            setSubmitOk('');
          }
          else if (res.error) {
            setErr(res.error);
            setErrHasAccount('');
            setSubmitOk('');
          }
        })
        .catch((err) => {
          console.error(err)
        });
    })

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
        {err !== '' &&
          <div className='error'>{err}</div>
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
          <label htmlFor="name1">Name</label>
          <input type="text" name="name" disabled={isPending} placeholder="name" id='name1' required onChange={handleInputChange} value={inputValue.name} />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" disabled={isPending} placeholder="email" id='email' required onChange={handleInputChange} value={inputValue.email} />
          <section className='checkbox-container'>
            <h3>Newsletter Subscriptions</h3>
            <div className='checkbox-list'>
              <div>
                <input type="checkbox" name="meat" disabled={isPending} id='meat' onChange={handleInputChange} checked={inputValue.meat} />
                <label htmlFor="meat">Meat</label>
              </div>
              <div>
                <input type="checkbox" name="vegetarian" disabled={isPending} id='vegetarian' onChange={handleInputChange} checked={inputValue.vegetarian} />
                <label htmlFor="vegetarian">Vegetarian</label>
              </div>
              <div>
                <input type="checkbox" name="dessert" disabled={isPending} id='dessert' onChange={handleInputChange} checked={inputValue.dessert} />
                <label htmlFor="dessert">Dessert</label>
              </div>
              <div>
                <input type="checkbox" name="pasta" disabled={isPending} id='pasta' onChange={handleInputChange} checked={inputValue.pasta} />
                <label htmlFor="pasta">Pasta</label>
              </div>
              <div>
                <input type="checkbox" name="seafood" disabled={isPending} id='seafood' onChange={handleInputChange} checked={inputValue.seafood} />
                <label htmlFor="seafood">Seafood</label>
              </div>
              <div>
                <input type="checkbox" name="side" disabled={isPending} id='side' onChange={handleInputChange} checked={inputValue.side} />
                <label htmlFor="side">Side</label>
              </div>
            </div>

          </section>

          <input type="submit" value="SIGN UP" disabled={isPending} className='submit-button' />
        </form>
      </div>
    </div>

  )
}
