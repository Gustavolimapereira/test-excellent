import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod'

const updateOrderBodySchema = z.object({
  clientId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELED']).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateOrderBodySchema)
type UpdateOrderBodySchema = z.infer<typeof updateOrderBodySchema>

@Controller('/orders/:id')
export class UpdateOrderController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateOrderBodySchema,
  ) {
    const { clientId, status } = body

    const findOrder = await this.prisma.order.findUnique({
      where: { id },
    })

    if (!findOrder) {
      throw new ConflictException('Order not found')
    }

    await this.prisma.order.update({
      where: { id },
      data: {
        clientId,
        status,
      },
    })

    return { message: 'Order updated successfully' }
  }
}
