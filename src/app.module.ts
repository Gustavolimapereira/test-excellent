import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { envSchema } from './env'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { AuthenticateModule } from './controllers/authenticate/authenticate.module'
import { UserModule } from './controllers/users/user.module'
import { ClientModule } from './controllers/clients/client.module'
import { ProductModule } from './controllers/products/product.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    AuthenticateModule,
    UserModule,
    ClientModule,
    ProductModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
