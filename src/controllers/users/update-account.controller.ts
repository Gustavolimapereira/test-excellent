import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import z from 'zod'

const updateAccountBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: z.enum(['ADMIN', 'COLABORATOR']).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateAccountBodySchema)
type UpdateAccountBodySchema = z.infer<typeof updateAccountBodySchema>

@Controller('/accounts/:id')
@UseGuards(JwtAuthGuard)
export class UpdateAccountController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateAccountBodySchema,
    @CurrentUser() userLoad: UserPayload,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role === 'COLABORATOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const { name, email, password, role } = body

    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('Usuario não encontrado')
    }

    if (email) {
      const userWitchSameEmail = await this.prisma.user.findUnique({
        where: { email },
      })

      if (userWitchSameEmail) {
        throw new NotFoundException('Email já cadastrado')
      }
    }

    let hashedPassword: string | undefined
    if (password) {
      hashedPassword = await hash(password, 8)
    }
    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })
    return { userUpdated }
  }
}
