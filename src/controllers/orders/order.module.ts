import { Module } from '@nestjs/common'
import { CreateOrderController } from './create-order.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateOrderController } from './update-order.controller'
import { ListAllOrderController } from './listAll-order.controller'
import { DeleteOrderController } from './delete-order.controller'

@Module({
  controllers: [
    CreateOrderController,
    UpdateOrderController,
    ListAllOrderController,
    DeleteOrderController,
  ],
  providers: [PrismaService],
})
export class OrderModule {}
