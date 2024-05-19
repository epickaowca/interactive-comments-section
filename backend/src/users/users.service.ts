import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInUserDto } from './dto/signIn-user.dto';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { selectUserFields } from './constants';

const { users } = new PrismaClient();

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    signInUserDto: SignInUserDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = signInUserDto;
    const user = await users.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async create(createUserDto: CreateUserDto) {
    const user = await users.findUnique({
      where: { username: createUserDto.username },
    });
    if (user) {
      throw new ConflictException('username already taken');
    }

    return users.create({ data: createUserDto });
  }

  async findAll() {
    return users.findMany({
      select: selectUserFields,
    });
  }

  async findOne(id: number, request: Request) {
    const username = request['user'].username;
    const userId = request['user'].sub;
    return username;
    return `This action returns a #${id} user`;
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
