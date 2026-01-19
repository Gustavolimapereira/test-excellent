import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateClientController } from './create-client.controller'
import { HttpModule } from '@nestjs/axios'
import { listClientController } from './listAll-client.controller'
import { DeleteClientController } from './delete-client.controller'
import { UpdateClientController } from './update-client.controller'

@Module({
  imports: [HttpModule],
  controllers: [
    CreateClientController,
    listClientController,
    DeleteClientController,
    UpdateClientController,
  ],
  providers: [PrismaService],
})
export class ClientModule {}
