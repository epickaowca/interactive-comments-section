import { FC, useState } from "react";
import { ProfileAvatar, availableAvatars } from "../../../ProfileAvatar";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import c from "./Post.module.scss";
import { ActionButtons } from "../ActionButtons";
import { LikesButton } from "../LikesButton";
import { Dialog } from "../../../Dialog";

export type PostProps = {
  avatar: (typeof availableAvatars)[number];
  name: string;
  yourComment: boolean;
  createdAt: Date;
  content: string;
  color: string;
  dislikes: string[];
  likes: string[];
  likesCount: number;
  _id: string;
  userId: string;
  nestingLevel: number;
};

type ExtraProps = {
  onReply: () => void;
  onEdit: () => void;
};

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export const Post: FC<PostProps & ExtraProps> = ({
  avatar,
  name,
  yourComment,
  createdAt,
  content,
  color,
  likesCount,
  _id,
  userId,
  nestingLevel,
  likes,
  dislikes,
  onReply,
  onEdit,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className={c.Post}>
      <div
        style={{ backgroundColor: color }}
        className={c.Post_circleLabel}
      ></div>
      <div className={c.Post_profile}>
        <ProfileAvatar imgName={avatar} />
        <strong className={c.Post_name}>{name}</strong>
        {yourComment && <strong className={c.Post_yourName}>you</strong>}
        <p className={c.Post_timeAgo}>
          {timeAgo.format(+new Date() - (+new Date() - +new Date(createdAt)))}
        </p>
      </div>
      <p className={c.Post_description}>{content}</p>
      <LikesButton
        likes={likes}
        dislikes={dislikes}
        commentId={_id}
        likesCount={likesCount}
      />
      {(nestingLevel < 3 || yourComment) && (
        <ActionButtons
          isYourComment={yourComment}
          onDelete={() => setShowDialog(true)}
          onReply={onReply}
          onEdit={onEdit}
        />
      )}

      {showDialog && (
        <Dialog
          type="remove"
          commentId={_id}
          onCancel={() => setShowDialog(false)}
          userId={userId}
        />
      )}
    </div>
  );
};
