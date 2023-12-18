import { Controller, Logger } from '@nestjs/common';
import { JogadoresService } from './jogadores.service'
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface'
import { TOPICS } from 'src/common/environment/environments';

const ackErrors: string[] = ['E11000']

@Controller()
export class JogadoresController {

    logger = new Logger(JogadoresController.name)
    constructor(private readonly jogadoresService: JogadoresService) {}

    @EventPattern(TOPICS.CRIAR_JOGADOR)
    async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            this.logger.log(`jogador: ${JSON.stringify(jogador)}`)
            await this.jogadoresService.criarJogador(jogador)
            await channel.ack(originalMsg)
    } catch(error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))
    
              if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
              }
        }
    }

   @MessagePattern(TOPICS.CONSULTAR_JOGADORES)
   async consultarJogadores(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    this.logger.log("chegue")
    try {
       if (_id) {
            return await this.jogadoresService.consultarJogadorPeloId(_id);
       } else {
            return await this.jogadoresService.consultarTodosJogadores();  
       } 
    } finally {
        await channel.ack(originalMsg)
    }      
   }

   @EventPattern(TOPICS.ATUALIZAR_JOGADOR)
   async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
        console.log(`data: ${JSON.stringify(data)}`)
        const _id: string = data.id
        const jogador: Jogador = data.jogador
        await this.jogadoresService.atualizarJogador(_id, jogador)
        await channel.ack(originalMsg)
    } catch(error) {
        const filterAckError = ackErrors.filter(
            ackError => error.message.includes(ackError))

          if (filterAckError.length > 0) {
            await channel.ack(originalMsg)
          }
    }  
}

    @EventPattern(TOPICS.DELETAR_JOGADOR)
    async deletarJogador(@Payload() _id: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            await this.jogadoresService.deletarJogador(_id)
            await channel.ack(originalMsg)
        } catch(error) {
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))
    
              if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
              }
        }
    }
}