import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductController } from './create-product.controller'
import { ListAllProductController } from './listAll-product.controller'
import { Module } from '@nestjs/common'

@Module({
  controllers: [CreateProductController, ListAllProductController],
  providers: [PrismaService],
})
export class ProductModule {}
