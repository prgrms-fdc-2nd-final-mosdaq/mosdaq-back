import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PollingMovieListDto } from './dto/polling-movie-list-response.dto';

@Injectable()
export class MovieListService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getPollingMovies(
    offset: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    userId: number | null = null,
  ): Promise<PollingMovieListDto> {
    const result = await this.entityManager.query(
      `
      SELECT 
        m.movie_id AS "movieId", 
        m.movie_title AS "movieTitle", 
        m.movie_poster AS "posterUrl",
        COUNT(CASE WHEN p.poll_flag THEN 1 END) AS "up",
        COUNT(CASE WHEN NOT p.poll_flag THEN 1 END) AS "down",
        CASE
            WHEN p.poll_flag IS TRUE THEN 'up'
            WHEN p.poll_flag IS FALSE THEN 'down'
            ELSE NULL
        END AS "myPollResult"
      FROM 
        movie m
      LEFT JOIN 
        poll p ON m.movie_id = p.fk_movie_id AND p.fk_user_id = $1
      WHERE 
        m.movie_open_date > CURRENT_DATE
      GROUP BY 
        m.movie_id, m.movie_title, m.movie_poster, m.movie_open_date, p.poll_flag
      ORDER BY 
        m.movie_open_date ${sort}
      OFFSET $2 LIMIT $3
      `,
      [userId, offset, limit],
    );

    return {
      movieList: result.map((row) => ({
        movieId: row.movieId,
        movieTitle: row.movieTitle,
        posterUrl: row.posterUrl,
        up: parseInt(row.up, 10),
        down: parseInt(row.down, 10),
        myPollResult: row.myPollResult,
      })),
      movieListCount: result.length,
      pagination: Math.ceil(result.length / limit),
    };
  }
}
