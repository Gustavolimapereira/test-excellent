import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class ListAllAccountController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page') page: string = '1',
    @Query('per_page') perPage: string = '10',
    @CurrentUser() userLoad: UserPayload,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role === 'COLABORATOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const pageNumber = Math.max(1, Number(page))
    const limit = Math.max(1, Number(perPage))

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        take: limit,
        skip: (pageNumber - 1) * limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.user.count(),
    ])

    return {
      data: users,
      meta: {
        page: pageNumber,
        per_page: limit,
        total_items: totalCount,
        total_pages: Math.ceil(totalCount / limit),
      },
    }
  }
}
