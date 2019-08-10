import { expect } from 'chai';
import Media from '../../../src/components/media/media.model';

describe('Media: Model', () => {
  it('should be invalid if title is empty', () => {
    const movie = new Media({});

    return movie.validate(err => {
      expect(err.errors.title).to.exist;
    });
  });

  it('should be invalid if file_path is empty', () => {
    const movie = new Media({});

    return movie.validate(err => {
      expect(err.errors.filePath).to.exist;
    });
  });

  it('should be invalid if duration is empty', () => {
    const movie = new Media({});

    return movie.validate(err => {
      expect(err.errors.duration).to.exist;
    });
  });

  it('should be invalid if type is different then movie or serie', () => {
    const movie = new Media({ type: 'filme' });

    return movie.validate(err => {
      expect(err.errors.type).to.exist;
    });
  });
});
