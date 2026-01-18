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

const updateProductBodySchema = z.object({
  description: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
})
const bodyValidationPipe = new ZodValidationPipe(updateProductBodySchema)
type UpdateProductBodySchema = z.infer<typeof updateProductBodySchema>

@Controller('/products/:id')
export class UpdateProductController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateProductBodySchema,
  ) {
    const { description, price, stock } = body

    const updateStock = await this.prisma.product.findUnique({
      where: { id },
    })

    if (!updateStock) {
      throw new ConflictException('Product not found')
    }

    const stockToUpdate = updateStock.stock + (stock ?? 0)

    const productUpdate = await this.prisma.product.update({
      where: { id },
      data: {
        description,
        price,
        stock: stockToUpdate,
      },
    })

    return {
      productUpdate,
    }
  }
}
