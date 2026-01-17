import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/users/create-account.controller'
import { ListAllAccountController } from './controllers/users/listAll-account.controller'
import { UpdateAccountController } from './controllers/users/update-account.controller'
import { DeleteAccountController } from './controllers/users/delete-account.controller'
import { envSchema } from './env'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AuthenticateModule } from './controllers/authenticate/authenticate.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    AuthenticateModule,
  ],
  controllers: [
    CreateAccountController,
    ListAllAccountController,
    UpdateAccountController,
    DeleteAccountController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
