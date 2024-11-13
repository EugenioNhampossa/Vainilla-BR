import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import axios, { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private ISSUER: string;
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;
  private CONNECTION: string;

  constructor(private config: ConfigService) {
    this.ISSUER = config.get('AUTH0_ISSUER_URL');
    this.CLIENT_ID = config.get('AUTH0_CLIENT_ID');
    this.CLIENT_SECRET = this.config.get('AUTH0_CLIENT_SECRET');
    this.CONNECTION = 'Username-Password-Authentication';
  }

  async getToken() {
    try {
      const options = {
        method: 'POST',
        url: 'https://dev-s7pyz56vu5hr2sbk.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
          audience: 'https://dev-s7pyz56vu5hr2sbk.us.auth0.com/api/v2/',
        }),
      };

      const res = await axios.request(options);
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        throw new UnauthorizedException(error.response.data.message);
      } else if (error.response.status == 403) {
        throw new ForbiddenException(error.response.data.message);
      } else if (error.response.status == 400) {
        throw new BadRequestException(error.response.data.message);
      }
      throw new InternalServerErrorException(
        error.response.data.message || 'Ops! Erro no servidor',
      );
    }
  }

  async create(dto: CreateUserDto) {
    const token = await this.getToken();
    try {
      const config = {
        method: 'POST',
        url: `${this.ISSUER}api/v2/users`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token.access_token}`,
        },
        data: {
          connection: this.CONNECTION,
          password: dto.password,
          email: dto.email,
          name: dto.name,
          user_metadata: {
            id_instalacao: dto.id_instalacao,
          },
        },
      };
      const res = await axios.request(config);
      this.AssignRole([dto.role], res.data.user_id);
    } catch (error) {
      if (error.response.status == 401) {
        throw new UnauthorizedException(error.response.data.message);
      } else if (error.response.status == 403) {
        throw new ForbiddenException(error.response.data.message);
      } else if (error.response.status == 400) {
        throw new BadRequestException(error.response.data.message);
      }
      throw new InternalServerErrorException(
        error.response.data.message || 'Ops! Erro no servidor',
      );
    }
  }

  async AssignRole(roles: string[], id: string) {
    const token = await this.getToken();
    const data = JSON.stringify({
      roles,
    });
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.ISSUER}api/v2/users/${id}/roles`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`,
        },
        data: data,
      };

      const res = await axios.request(config);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(
        error.response.data.message || 'Ops! Erro no servidor',
      );
    }
  }

  async getRoles() {
    const token = await this.getToken();
    try {
      const config = {
        method: 'get',
        url: `${this.ISSUER}api/v2/roles`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token.access_token}`,
        },
      };
      const res = await axios.request(config);
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        throw new UnauthorizedException(error.response.data.message);
      } else if (error.response.status == 403) {
        throw new ForbiddenException(error.response.data.message);
      } else if (error.response.status == 400) {
        throw new BadRequestException(error.response.data.message);
      }
      throw new InternalServerErrorException(
        error.response.data.message || 'Ops! Erro no servidor',
      );
    }
  }

  async findAll() {
    const token = await this.getToken();
    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://dev-s7pyz56vu5hr2sbk.us.auth0.com/api/v2/users',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token.access_token}`,
        },
      };
      const res = await axios.request(config);

      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        throw new UnauthorizedException(error.response.data.message);
      } else if (error.response.status == 403) {
        throw new ForbiddenException(error.response.data.message);
      } else if (error.response.status == 400) {
        throw new BadRequestException(error.response.data.message);
      }
      throw new InternalServerErrorException(
        error.response.data.message || 'Ops! Erro no servidor',
      );
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
