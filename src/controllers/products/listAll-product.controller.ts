import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/products')
export class ListAllProductController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '10',
  ) {
    const pageNumber = Math.max(1, Number(page))
    const limit = Math.max(1, Number(perPage))

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        take: limit,
        skip: (pageNumber - 1) * limit,
        select: {
          id: true,
          description: true,
          price: true,
          stock: true,
          images: true,
        },
        orderBy: {
          description: 'asc',
        },
      }),
      this.prisma.product.count(),
    ])

    return {
      data: products,
      meta: {
        page: pageNumber,
        per_page: limit,
        total_items: totalCount,
        total_pages: Math.ceil(totalCount / limit),
      },
    }
  }
}
