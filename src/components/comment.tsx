import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { KeyedMutator } from "swr";
import { comments } from "../types/apitype";



export default function CommentShow(props: { recipeId: number, data: comments[] | undefined, comment: string, canChange: string, name: string, id: string, mutate: KeyedMutator<comments[]> }) {
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
      setEditCancel('Edit');
      setShowDelete(true);
    }
  }

  const handleDelete = async () => {
    try {
      props.mutate([...props!.data!.filter(item => item._id !== props.id)], false)
      const res = await fetch(`/deletecomment/${props.id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json, text/plain",
          "Content-type": "application/json"
        }
      });

      if (res.status !== 204) {
        const resJson = await res.json();
        if (resJson.error) console.error(resJson.error);
        props.mutate()
      }
    } catch (error) {
      console.error(error)
    }

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
    try {
      setEdit(false);
      setShowDelete(true);
      props.mutate([...props.data!.map((item) => item._id === props.id ? { _id: props.id, canChange: 'true', name: item.name, comment: comment } : { _id: props.id, canChange: 'true', name: item.name, comment: item.comment })])
      const res = await fetch(`/updatecomment/${props.id}`, {
        method: "PATCH",
        headers: {
          "Accept": "application/json, text/plain",
          "Content-type": "application/json"
        },
        body: JSON.stringify({ comment: comment })
      });

      if (res.status !== 204) {
        const resJson = await res.json();
        if (resJson.error) console.error(resJson.error);

        props.mutate()
      }
    } catch (error) {
      console.error(error)
    }

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
