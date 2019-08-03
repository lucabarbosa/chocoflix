import { expect } from 'chai';
import Category from '../../../src/components/category/category.model';

describe('Category: model', () => {
  it('should be invalid if name is empty', () => {
    const category = new Category();
    category.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });
});
