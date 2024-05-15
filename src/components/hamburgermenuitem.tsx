import { Link } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function HamburgermenuItem(props: { menuItem: string, setMenuActive: Dispatcher<boolean>, setHamburgerMenuClass: Dispatcher<string> }) {
  const clickLinkMenu = () => {
    props.setMenuActive(false);
    props.setHamburgerMenuClass('');
  };

  return (
    <li>
      <Link onClick={clickLinkMenu} to={`./${props.menuItem.toLowerCase()}`}>
        {props.menuItem}
      </Link>
    </li>
  )
}