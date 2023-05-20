import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '@auth'
import { User } from '@auth/entities'
import { PlayersModule } from '@players'
import { Player } from '@players/entities'
import { TeamsModule } from '@teams'
import { Team } from '@teams/entities'

import { Game } from './entities'
import { GamesController } from './games.controller'
import { GamesRepository } from './games.repository'
import { GamesService } from './games.service'
import { TimerGateway } from './timer.gateway'

@Module({
  controllers: [GamesController],
  providers: [GamesService, GamesRepository, TimerGateway],
  imports: [
    AuthModule,
    TeamsModule,
    PlayersModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Player]),
    TypeOrmModule.forFeature([Team]),
    TypeOrmModule.forFeature([Game]),
  ],
  exports: [GamesService],
})
export class GamesModule {}
