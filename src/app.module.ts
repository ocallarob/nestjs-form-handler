import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormDefinitionModule } from './form-definitions/form-definitions.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [FormDefinitionModule]
})
export class AppModule {}
