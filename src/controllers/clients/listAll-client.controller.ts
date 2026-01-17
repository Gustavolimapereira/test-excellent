import { Controller, Get, HttpCode, Query } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/clients')
export class listClientController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(201)
  async handle(
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '10',
  ) {
    const pageNumber = Math.max(1, Number(page))
    const limit = Math.max(1, Number(perPage))

    const [clients, totalCount] = await Promise.all([
      this.prisma.client.findMany({
        take: limit,
        skip: (pageNumber - 1) * limit,
        select: {
          id: true,
          razao_social: true,
          email: true,
          cnpj: true,
          created_at: true,
        },
        orderBy: {
          razao_social: 'asc',
        },
      }),
      this.prisma.client.count(),
    ])

    return {
      data: clients,
      meta: {
        page: pageNumber,
        per_page: limit,
        total_items: totalCount,
        total_pages: Math.ceil(totalCount / limit),
      },
    }
  }
}
