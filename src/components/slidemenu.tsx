import { Link } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

type Dispatcher<S> = Dispatch<SetStateAction<S>>

export default function Slidemenu(props: { menuItem: string, setDropDownShow: Dispatcher<boolean> }) {
  return (
    <li>
      <Link to={`./${props.menuItem.toLowerCase()}`} onFocus={() => props.setDropDownShow(false)}>
        {props.menuItem}
      </Link>
    </li>
  )
}
