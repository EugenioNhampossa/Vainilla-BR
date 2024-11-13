import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TsRestModule } from '@ts-rest/nest';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TsRestModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'web', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    TodosModule,
  ],
})
export class AppModule {}
