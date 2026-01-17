import { HttpService } from '@nestjs/axios'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod'
import { firstValueFrom } from 'rxjs'

const createClientBodySchema = z.object({
  razaosocial: z.string().optional(),
  cnpj: z.string(),
  email: z.string().optional(),
})

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>

@Controller('/clients')
export class CreateClientController {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createClientBodySchema))
  async handle(@Body() body: CreateClientBodySchema) {
    const { cnpj } = body

    const clientWithSameCnpj = await this.prisma.client.findUnique({
      where: {
        cnpj,
      },
    })

    if (clientWithSameCnpj) {
      throw new ConflictException('CNPJ already in use')
    }

    const getCnpjOnlyNumbers = cnpj.replace(/\D/g, '')

    const response = await firstValueFrom(
      this.httpService.get(
        `https://publica.cnpj.ws/cnpj/${getCnpjOnlyNumbers}`,
      ),
    )

    const clientRazaoSocial = response.data.razao_social
    const emailData = response.data.estabelecimento?.email

    const dataCreate = await this.prisma.client.create({
      data: {
        razao_social: clientRazaoSocial,
        email: emailData,
        cnpj,
      },
    })

    return { dataCreate }
  }
}
