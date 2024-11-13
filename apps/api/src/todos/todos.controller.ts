import { Controller } from '@nestjs/common';
import { TodosService } from './todos.service';
import { todoContract } from '@repo/api-contract';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

@Controller()
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @TsRestHandler(todoContract)
  async handler() {
    return tsRestHandler(todoContract, {
      create: async ({ body }) => {
        return {
          status: 201,
          body: await this.todosService.create(body),
        };
      },

      getAll: async ({ query: { title } }) => {
        return {
          status: 200,
          body: await this.todosService.getAll(title),
        };
      },

      getOne: async ({ params }) => {
        const todo = await this.todosService.getOne(params.id);
        if (!todo) {
          return {
            status: 404,
            body: {
              message: 'Not found',
            },
          };
        }
        return {
          status: 200,
          body: todo,
        };
      },

      update: async ({ params }) => {
        const todo = await this.todosService.update(params.id);
        if (!todo) {
          return {
            status: 404,
            body: {
              message: 'Not found',
            },
          };
        }
        return {
          status: 200,
          body: todo,
        };
      },

      remove: async ({ params }) => {
        const todo = await this.todosService.remove(params.id);

        if (!todo) {
          return {
            status: 404,
            body: {
              message: 'Not found',
            },
          };
        }
        return {
          status: 204,
          body: null,
        };
      },
    });
  }
}
