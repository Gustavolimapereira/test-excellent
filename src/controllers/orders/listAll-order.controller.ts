import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/orders')
export class ListAllOrderController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '10',
  ) {
    const pageNumber = Math.max(1, Number(page))
    const limit = Math.max(1, Number(perPage))

    const [orders, totalCount] = await Promise.all([
      this.prisma.order.findMany({
        take: limit,
        skip: (pageNumber - 1) * limit,
        include: {
          client: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.order.count(),
    ])

    return {
      data: orders,
      meta: {
        page: pageNumber,
        per_page: limit,
        total_items: totalCount,
        total_pages: Math.ceil(totalCount / limit),
      },
    }
  }
}
