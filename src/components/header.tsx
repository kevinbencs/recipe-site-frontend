import { Link, useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useState, useEffect, useRef, KeyboardEvent } from 'react';
import SearchImg from '../img/search2.png';
import Headersearch from './headersearch';
import Menu from './menu';
import { useLogged } from './userProvider';


type Dispatcher<S> = Dispatch<SetStateAction<S>>;


export default function Header(props: { setNewsletterShown: Dispatcher<boolean>, isNewsletterShown: boolean }) {

  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );

  const [formShow, setFormShow] = useState<boolean>(false);
  const [showSliderMenu, setShowSliderMenu] = useState<boolean>(true);
  const [isMenuActive, setMenuActive] = useState<boolean>(false);
  const [showNewsLetter, setShowNewsLetter] = useState<boolean>(true);
  const [hamburgerMenuClass, setHamburgerMenuClass] = useState<string>("");
  const hamburgerMenuFocus = useRef<HTMLLabelElement>(null);
  const [dropDownShow, setDropDownShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const {userName, setName, loading} = useLogged()


  const newsletterShow = () => {
    props.setNewsletterShown(!props.isNewsletterShown);
  };

  useEffect(() => {
    function handleResize() {
      setWindowSize(
        window.innerWidth
      );
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  });

  useEffect(() => {
    if (windowSize < 1001) {
      setShowSliderMenu(false);
    }
    else {
      setShowSliderMenu(true);
    }

    if (windowSize < 721 || userName !== "") {
      setShowNewsLetter(false);
    }
    else {
      setShowNewsLetter(true);
    }
  }, [windowSize, userName]);


  const keyDownDropMenu = (e: KeyboardEvent<HTMLElement>) => {
    if (e.code === 'Enter'){
      setDropDownShow(!dropDownShow);
    }
  };
 

  const handleClickShowSearch = () => {
    setFormShow(true);
  };

  const clickHamburgerMenu = () => {
    if (isMenuActive === false) {
      setHamburgerMenuClass('hamburger-menu-active');
    }
    else {
      setHamburgerMenuClass('');
    }
    setMenuActive(!isMenuActive);
    hamburgerMenuFocus.current?.blur();

  }

  const keyDownkHamburgerMenu = (e: KeyboardEvent<HTMLElement>) => {
    if (e.code === 'Enter') {
      if (isMenuActive === false) {
        setHamburgerMenuClass('hamburger-menu-active');
      }
      else {
        setHamburgerMenuClass('');
      }
      setMenuActive(!isMenuActive);
    }
  }

  const Logout = async () => {
    setDropDownShow(false);
    await fetch('/logout', {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: 'include',
    });
    setName('');
    navigate('/');
  };

  const keyDownLogout = (e: KeyboardEvent<MathMLElement>) => {
    if(e.code === 'Enter'){
      Logout();
    }
  }




  return (
    <header>
      <div className='header-newsletter'>
        <nav className='logo'>

            <Link to='/'>Recipe</Link>

        </nav>
        <div className='newsletter-search-button'>

          {showNewsLetter &&
            <div className='newsletter-on-click' onClick={newsletterShow} tabIndex={0} >Newsletter</div>
          }
          <button className='search-show-button' onClick={handleClickShowSearch} onFocus={() => setDropDownShow(false)}>
            <img src={SearchImg} alt="search" />
          </button>

          {loading && 
            <div>...Loading</div>
          }
          
          {(userName === '' && !loading) &&
            <nav className='signin-signup'>
              <Link to='/signin'>Sign in</Link>
              <Link to='/signup' className='signup'>Sign up</Link>
            </nav>
          }

          {(userName !== '' && !loading) &&
            <div className='dropdown' onMouseEnter={() => setDropDownShow(true)} onMouseLeave={() => setDropDownShow(false)}>
              <button className='dropbtn' onKeyDown={keyDownDropMenu} >{userName}</button>
              {dropDownShow &&
                <section className='dropdown-content' >
                  <Link to='/newpassword' onClick={() => setDropDownShow(false)}>New password</Link>
                  <div onClick={Logout} onKeyDown={keyDownLogout} tabIndex={0} >Log out</div>
                </section>
              }

            </div>
          }

        </div>
      </div>

      <Headersearch formShow={formShow} setFormShow={setFormShow} />

      {!showSliderMenu &&
        <label className='hamburger-menu-label' onClick={clickHamburgerMenu} tabIndex={0} onKeyDown={keyDownkHamburgerMenu} ref={hamburgerMenuFocus} onFocus={(() => setDropDownShow(false))}>
          <span className={`hamburger-menu ${hamburgerMenuClass}`}></span>
        </label>
      }

      <Menu isMenuActive={isMenuActive} showSliderMenu={showSliderMenu} setMenuActive={setMenuActive} setHamburgerMenuClass={setHamburgerMenuClass} setDropDownShow={setDropDownShow}/>


    </header>
  )
}
