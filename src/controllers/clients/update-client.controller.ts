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

const updateClientBodySchema = z.object({
  razaosocial: z.string().optional(),
  cnpj: z.string(),
  email: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateClientBodySchema)
type UpdateClientBodySchema = z.infer<typeof updateClientBodySchema>

@Controller('/clients/:id')
export class UpdateClientController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateClientBodySchema,
  ) {
    const { razaosocial, cnpj, email } = body

    const clientUpdate = await this.prisma.client.findUnique({
      where: { id },
    })

    if (!clientUpdate) {
      throw new ConflictException('Client not found')
    }

    await this.prisma.client.update({
      where: { id },
      data: {
        razao_social: razaosocial,
        cnpj,
        email,
      },
    })

    return {
      message: 'Client updated successfully',
    }
  }
}
