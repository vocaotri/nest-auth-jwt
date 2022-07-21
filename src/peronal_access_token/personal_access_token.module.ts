import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonalAccessToken, PersonalAccessTokenSchema } from './personal_access_token.schema';
import { PeronalAccessTokenService } from './personal_access_token.service';

@Module({
  providers: [PeronalAccessTokenService],
  exports: [PeronalAccessTokenService],
  imports:[MongooseModule.forFeature([{ name: PersonalAccessToken.name, schema: PersonalAccessTokenSchema }])],
})
export class PeronalAccessTokenModule {}
