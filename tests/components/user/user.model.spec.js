import { expect } from 'chai';
import User from '../../../src/components/user/user.model';

describe('User: model', () => {
  it('should be invalid if name, email or password is empty', () => {
    const user = new User();
    return user.validate(err => {
      expect(err.errors.name).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.password).to.exist;
    });
  });
});
