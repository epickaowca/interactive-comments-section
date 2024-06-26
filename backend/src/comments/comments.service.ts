import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@prisma/client';
import { selectCommentFields } from './constants';
import { SocketGateway } from 'src/socket/socket.gateway';

const { comments } = new PrismaClient();

@Injectable()
export class CommentsService {
  constructor(private readonly socketGateway: SocketGateway) {}

  async create(createCommentDto: CreateCommentDto, authorId: string) {
    const { content, parentId } = createCommentDto;

    if (content.length > 4000) {
      throw new HttpException(
        'maximum length of content is 4000',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    const newComment = await comments.create({
      data: { content, authorId, parentId },
      select: selectCommentFields,
    });
    await this.socketGateway.server.emit('comment-added', newComment);
    return newComment;
  }

  async findAll() {
    return await comments.findMany({
      select: selectCommentFields,
    });
  }

  async update(id: string, { content }: UpdateCommentDto, authorId: string) {
    const comment = await comments.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException();
    if (comment.authorId !== authorId) throw new UnauthorizedException();

    if (content.length > 4000) {
      throw new HttpException(
        'maximum length of content is 4000',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }

    const newComment = await comments.update({
      where: { id },
      data: { content },
      select: selectCommentFields,
    });
    await this.socketGateway.server.emit('comment-edited', newComment);
    return newComment;
  }

  async remove(id: string, authorId: string) {
    const comment = await comments.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException();
    if (comment.authorId !== authorId) throw new UnauthorizedException();

    const commentRemoved = await comments.delete({
      where: { id },
      select: selectCommentFields,
    });
    await this.socketGateway.server.emit('comment-removed', id);
    return commentRemoved;
  }

  async like(id: string, authorId: string) {
    const comment = await comments.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException();

    let likesArr = [...comment.likes];
    let dislikesArr = [...comment.dislikes];
    const hasLiked = likesArr.includes(authorId);
    const hasDisliked = dislikesArr.includes(authorId);

    if (!hasLiked && !hasDisliked) {
      likesArr.push(authorId);
    } else if (hasLiked) {
      likesArr = likesArr.filter((id) => id !== authorId);
    } else {
      dislikesArr = dislikesArr.filter((id) => id !== authorId);
      likesArr.push(authorId);
    }

    const newComment = await comments.update({
      where: { id },
      data: {
        likes: likesArr,
        dislikes: dislikesArr,
        likesCount: likesArr.length - dislikesArr.length,
      },
      select: selectCommentFields,
    });
    await this.socketGateway.server.emit('comment-edited', newComment);

    return newComment;
  }

  async dislike(id: string, authorId: string) {
    const comment = await comments.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException();

    let likesArr = [...comment.likes];
    let dislikesArr = [...comment.dislikes];
    const hasLiked = likesArr.includes(authorId);
    const hasDisliked = dislikesArr.includes(authorId);

    if (!hasLiked && !hasDisliked) {
      dislikesArr.push(authorId);
    } else if (hasDisliked) {
      dislikesArr = dislikesArr.filter((id) => id !== authorId);
    } else {
      likesArr = likesArr.filter((id) => id !== authorId);
      dislikesArr.push(authorId);
    }

    const newComment = await comments.update({
      where: { id },
      data: {
        likes: likesArr,
        dislikes: dislikesArr,
        likesCount: likesArr.length - dislikesArr.length,
      },
      select: selectCommentFields,
    });
    await this.socketGateway.server.emit('comment-edited', newComment);

    return newComment;
  }

  async deleteAll() {
    return await comments.deleteMany();
  }
}
