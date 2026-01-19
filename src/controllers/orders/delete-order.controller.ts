import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import {
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserPayload } from 'src/auth/jwt.strategy'
import { CurrentUser } from 'src/auth/current-user-decorator'

@Controller('orders/:id')
@UseGuards(JwtAuthGuard)
export class DeleteOrderController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(201)
  async handle(@CurrentUser() userLoad: UserPayload, @Param('id') id: string) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role === 'COLABORATOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      throw new NotFoundException('Pedido não encontrado')
    }

    const teste = await this.prisma.orderItem.findMany({
      where: { orderId: id },
    })

    for (const item of teste) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        throw new ConflictException(`Produto ${item.productId} não encontrado`)
      }

      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: product.stock + item.quantity,
        },
      })
    }

    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    })

    await this.prisma.order.delete({
      where: { id },
    })

    console.log('Delete order is disabled temporarily')

    return {
      teste,
      message: 'mensagem de teste',
    }
  }
}
