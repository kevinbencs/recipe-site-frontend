import { useEffect, useRef, useState } from 'react'
import CommentShow from './comment';
import { SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface comments {
  comment: string,
  canChange: string,
  name: string,
  id: string
}

export default function CommemtContainer(props: { recipeId: number, hideComments: string, account: string }) {
  const [Comment, setComment] = useState<string>('');
  const commentValue = useRef<HTMLParagraphElement>(null);
  const [oldComments, setOldCmments] = useState<comments[]>([]);
  const [deleteComment, setDeleteComment] = useState<string>('');

  const sendComment = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (Comment !== '') {
      await fetch('/sendcomment', {
        method: "POST",
        headers: {
          "Accept": "aplication/json, text/plain",
          "Content-type": "application/json"
        },
        body: JSON.stringify({ comment: Comment, recipeId: props.recipeId })
      });
    }
    let oldcomments: comments[] = oldComments;
    oldcomments.push({ comment: Comment, canChange: "true", name: props.account, id: String(oldComments.length) });
    setOldCmments(oldcomments);
    setComment('');
    if (commentValue.current !== null) commentValue.current.innerText = '';
  };

  useEffect(() => {
    setOldCmments(oldComments.filter((comment: comments) => comment.id !== deleteComment));
  }, [deleteComment])

  useEffect(() => {
    setOldCmments([]);
    const getComment = async () => {
      fetch('/getcomment', {
        method: "POST",
        headers: {
          "Accept": "application/json, text/plain",
          "Content": "apllication/json"
        },
        body: JSON.stringify({ recipeId: props.recipeId })
      })
        .then(data => data.json())
        .then(res => {
          if (res.length !== 0) setOldCmments(res as unknown as comments[]);
        });
    }
    getComment();
  }, [props.recipeId]);

  const handleComment = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    setComment(e.target.innerText);
  };

  return (
    <div className={`comment-section ${props.hideComments}`}>
      <h3>Comments</h3>
      {props.account !== '' && <form action="" method='post' onSubmit={sendComment} className='comment-form'>
        <p contentEditable="true" onInput={handleComment} ref={commentValue} tabIndex={0}></p>
        <input type="submit" value="Send" />
      </form>}

      <div className='comment-container-container'>
        {oldComments.length !== 0 &&
          oldComments.map((comment: comments) => <CommentShow comment={comment.comment}
            name={comment.name}
            canChange={comment.canChange}
            id={comment.id}
            setDeleteComment={setDeleteComment}
            key={uuidv4()} />)}
        {oldComments.length === 0 && <div>kell</div>}

      </div>
    </div>
  )
}
