import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Todo } from '@repo/api-contract';

@Injectable()
export class TodosService {
  constructor(private config: ConfigService) {}

  db = [
    { id: 1, title: 'todo1', description: 'desc1' },
    { id: 2, title: 'todo2', description: 'desc2' },
    { id: 3, title: 'todo3', description: 'desc3' },
  ];

  async create(dto: Omit<Todo, 'id'>) {
    this.db.push({ id: 4, ...dto });
    return this.db.at(3);
  }

  async getAll(title: string) {
    return this.db;
  }

  async getOne(id: number) {
    //query
    return this.db.at(id);
  }

  async update(id: number) {
    return this.db.at(id);
  }

  remove(id: number) {
    return null;
  }
}
