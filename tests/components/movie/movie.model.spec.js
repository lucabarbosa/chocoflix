import { expect } from 'chai';
import Movie from '../../../src/components/movie/movie.model';

describe('Movie: Model', () => {
  it('should be invalid is title is empty', () => {
    const movie = new Movie();
    movie.validate(err => {
      expect(err.errors.title).to.exist;
    });
  });
});
