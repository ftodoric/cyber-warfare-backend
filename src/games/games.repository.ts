import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { User } from 'src/auth/user.entity'
import { DataSource, Repository } from 'typeorm'

import { GameDto } from './dto/game.dto'
import { Game } from './game.entity'

@Injectable()
export class GamesRepository extends Repository<Game> {
  constructor(dataSource: DataSource) {
    super(Game, dataSource.createEntityManager())
  }

  async createGame(gameDto: GameDto): Promise<string> {
    const game = this.create(gameDto)
    try {
      await this.save(game)
    } catch (error) {
      // Duplicate game
      if (error.code === '23505')
        throw new ConflictException('A game with that name already exists.')
      else throw new InternalServerErrorException()
    }

    return game.id
  }

  async getGames(user: User): Promise<Game[]> {
    const query = this.createQueryBuilder('game')
      .select('game.status')
      .addSelect('game.description')
      .addSelect('blueTeam.name')
      .addSelect('redTeam.name')
      .innerJoin('game.blueTeam', 'blueTeam')
      .innerJoin('game.redTeam', 'redTeam')
      .where('blueTeam.peoplePlayerId = :id', { id: user.id })
      .orWhere('blueTeam.industryPlayerId = :id', { id: user.id })
      .orWhere('blueTeam.governmentPlayerId = :id', { id: user.id })
      .orWhere('blueTeam.energyPlayerId = :id', { id: user.id })
      .orWhere('blueTeam.intelligencePlayerId = :id', { id: user.id })
      .orWhere('redTeam.peoplePlayerId = :id', { id: user.id })
      .orWhere('redTeam.industryPlayerId = :id', { id: user.id })
      .orWhere('redTeam.governmentPlayerId = :id', { id: user.id })
      .orWhere('redTeam.energyPlayerId = :id', { id: user.id })
      .orWhere('redTeam.intelligencePlayerId = :id', { id: user.id })
    return query.getMany()
  }
}
