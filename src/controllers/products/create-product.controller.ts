import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod'

const createProductBodySchema = z.object({
  description: z.string(),
  price: z.number(),
  stock: z.number(),
})

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller('/products')
export class CreateProductController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateProductBodySchema) {
    const { description, price, stock } = body

    if (price <= 0) {
      throw new ConflictException('Price must be greater than zero')
    }

    if (stock < 0) {
      throw new ConflictException('Stock cannot be negative')
    }

    await this.prisma.product.create({
      data: {
        description,
        price,
        stock,
      },
    })

    return {
      message: 'Product created successfully',
    }
  }
}
