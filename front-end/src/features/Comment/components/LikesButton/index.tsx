import { FC } from "react";
import iconMinus from "../../assets/icon-minus.svg";
import iconPlus from "../../assets/icon-plus.svg";
import { useAsyncFn } from "../../../../hooks/useAsync";
import { addLike } from "../../../../services/comments";

import { useComment } from "../../../../context/comment";
import { Dialog } from "../../../Dialog";
import c from "./LikesButton.module.scss";

type LikesBtnProps = {
  commentId: string;
};

export const LikesButton: FC<LikesBtnProps> = ({ commentId }) => {
  const userId = "test";
  const { comment } = useComment(commentId);
  const { likes, likesCount, dislikes } = comment!;
  const { execute, error, setError } = useAsyncFn(addLike);

  const clickHandler = (likeType: "like" | "dislike") => {
    execute({ commentId, likeType, userId });
  };

  return (
    <>
      <div className={c.LikesButton}>
        <button
          className={btnClassName(likes, userId)}
          onClick={() => clickHandler("like")}
        >
          <img src={iconPlus} alt="plus icon" />
        </button>
        <strong className={c.LikesButton_count}>{likesCount}</strong>
        <button
          className={btnClassName(dislikes, userId)}
          onClick={() => clickHandler("dislike")}
        >
          <img src={iconMinus} alt="minus icon" />
        </button>
      </div>

      {error && (
        <Dialog
          elapsedTime={error.elapsedTime}
          description={error.message}
          onCancel={() => {
            setError(false);
          }}
        />
      )}
    </>
  );
};

const btnClassName = (arr: string[], id: string) => {
  const isLikeAdded = arr.find((e) => e === id);

  return `${c.LikesButton_button}${` ${
    isLikeAdded ? c.LikesButton_button___disabled : ""
  }`}`;
};
