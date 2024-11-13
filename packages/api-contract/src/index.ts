import { todoContract, todoSchema } from "./todo.contract";
import { z } from "zod";

export type Todo = z.infer<typeof todoSchema>;

export { todoContract };
