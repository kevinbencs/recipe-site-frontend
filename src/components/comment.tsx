import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useRef, useState } from "react";

type Dispatcher<S> = Dispatch<SetStateAction<S>>

export default function CommentShow(props: { comment: string, canChange: string, name: string, id: string, setDeleteComment: Dispatcher<string> }) {
  const [edit, setEdit] = useState<boolean>(false);
  const [comment, setComment] = useState<string>(props.comment);
  const commentRef = useRef<HTMLParagraphElement>(null);
  const [editCancel, setEditCancel] = useState<string>('Edit');
  const [showDelete, setShowDelete] = useState<boolean>(props.canChange === 'true' ? true : false);

  const handleClick = () => {
    if (!edit) {
      setEdit(true);
      setEditCancel('Cancel')
      setShowDelete(false);
    }
    else {
      setEdit(false);
      setEditCancel('Edit')
      setShowDelete(true);
    }
  }

  const handleDelete = async () => {
    await fetch('/deletecomment', {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json"
      },
      body: JSON.stringify({ id: props.id })
    });
    props.setDeleteComment(props.id);
  }

  useEffect(() => {
    if (edit) {
      if (commentRef.current !== null) {
        commentRef.current.innerText = props.comment;
        commentRef.current.focus();
      }
    }
  }, [edit])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await fetch('/updatecomment', {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json"
      },
      body: JSON.stringify({ comment: comment, id: props.id })
    });
    setEdit(false);
    setShowDelete(true);
    props.comment = comment;
  };

  const handleComment = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    setComment(e.target.innerText);
  };

  return (
    <div className="comment-conatiner">
      {!edit &&
        <>
          <div className="author-of-comment">{props.name}</div>
          <div className="comment">{props.comment}</div>
        </>
      }
      {edit && <form action="" method="POST" onSubmit={handleSubmit}>
        <p contentEditable="true" ref={commentRef} onInput={handleComment} tabIndex={0}></p>
        <input type="submit" value='Send' />
      </form>}

      {props.canChange === 'true' &&
        <div className="button-conatiner">
          <button className="edit" onClick={handleClick}>{editCancel}</button>
          {showDelete && <button className="edit" onClick={handleDelete}>Delete</button>}
        </div>
      }

    </div>
  )
}
