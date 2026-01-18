import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductController } from './create-product.controller'
import { ListAllProductController } from './listAll-product.controller'
import { Module } from '@nestjs/common'
import { UpdateProductController } from './update-product.controller'
import { DeleteProductController } from './delete-product.controller'

@Module({
  controllers: [
    CreateProductController,
    ListAllProductController,
    UpdateProductController,
    DeleteProductController,
  ],
  providers: [PrismaService],
})
export class ProductModule {}
