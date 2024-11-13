import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { PaginateOptions } from 'src/shared/dto';

export class FilterUserDto extends IntersectionType(
  PartialType(CreateUserDto),
  PaginateOptions,
) {}
