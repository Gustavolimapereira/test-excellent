import { Module } from '@nestjs/common'
import { CreateOrderController } from './create-order.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [CreateOrderController],
  providers: [PrismaService],
})
export class OrderModule {}
