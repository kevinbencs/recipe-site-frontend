import { Dispatch, SetStateAction, SyntheticEvent, KeyboardEvent } from 'react';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function Newsletter(props: { setNewsletterShown: Dispatcher<boolean> }) {

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    newsletterClose();
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
        <form action="#" method='Post' onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" placeholder="name" id='name' required />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="email" id='email' required />
          <section className='checkbox-container'>
            <h3>Newsletter Subscriptions</h3>
            <div className='checkbox-list'>
              <div>
                <input type="checkbox" id="meat" />
                <label htmlFor="meat">Meat</label>
              </div>
              <div>
                <input type="checkbox" id="vegetable" />
                <label htmlFor="vegetable">Vegetable</label>
              </div>
              <div>
                <input type="checkbox" id="dessert" />
                <label htmlFor="dessert">Dessert</label>
              </div>
              <div>
                <input type="checkbox" id="pasta" />
                <label htmlFor="pasta">Pasta</label>
              </div>
              <div>
                <input type="checkbox" id="seafood" />
                <label htmlFor="seafood">Seafood</label>
              </div>
              <div>
                <input type="checkbox" id="side" className='side' />
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
