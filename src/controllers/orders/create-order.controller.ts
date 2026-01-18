import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod'

const createOrderBodySchema = z.object({
  clientId: z.string().uuid(),

  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, 'O pedido deve ter ao menos um produto'),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)
type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateOrderBodySchema) {
    const { clientId, items } = body

    // 1. Criar o pedido (ORDER) uma única vez fora do loop
    const order = await this.prisma.order.create({
      data: {
        clientId,
      },
    })

    // 2. Agora percorremos os itens para validar estoque e criar os OrderItems
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        throw new ConflictException(`Produto ${item.productId} não encontrado`)
      }

      if (product.stock < item.quantity) {
        throw new ConflictException(
          `Estoque insuficiente para o produto: ${product.description}`,
        )
      }

      // Atualiza o estoque do produto
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      })

      const price = Number(product.price) * item.quantity

      // 3. Cria o item vinculado ao pedido único criado lá em cima
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id, // ID fixo do pedido criado no início
          productId: item.productId,
          quantity: item.quantity,
          price,
        },
      })
    }

    return {
      message: 'Order created successfully',
      orderId: order.id,
    }
  }
}
