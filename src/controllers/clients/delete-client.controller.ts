import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/clients/:id')
@UseGuards(JwtAuthGuard)
export class DeleteClientController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    })

    if (!client) {
      throw new NotFoundException('Cliente não encontrado')
    }

    await this.prisma.client.delete({
      where: { id },
    })
  }
}
