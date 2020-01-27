import { Module } from '@nestjs/common';
import { FormDefinitionController } from './form-definitions.controller';
import { FormDefinitionService } from './form-definitions.service';
import { DatabaseModule } from '../database-providers/database.module';

@Module({
  controllers: [FormDefinitionController],
  providers: [FormDefinitionService],
  imports: [DatabaseModule],
  exports: [FormDefinitionService]
})
export class FormDefinitionModule {}
