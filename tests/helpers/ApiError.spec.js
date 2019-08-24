import { expect } from 'chai';

import ApiError from '../../src/helpers/ApiError';

describe('ApiError', () => {
  it("should have message 'Internal Server Error.' when no message is passed.", () => {
    const err = new ApiError();
    expect(err)
      .to.be.an.instanceOf(ApiError)
      .with.property('message', 'Internal Server Error.');
  });

  it("should have status '500' when no code is passed.", () => {
    const err = new ApiError();
    expect(err)
      .to.be.an.instanceOf(ApiError)
      .with.property('code', 500);
  });

  it("should have message 'Invalid Token.' when status is 401.", () => {
    const err = new ApiError(401);
    expect(err)
      .to.be.an.instanceOf(ApiError)
      .with.property('message', 'Invalid Token.');
  });

  it("should have message 'Resource Not Found.' when status is 404 and resource wasn't passed.", () => {
    const err = new ApiError(404);
    expect(err)
      .to.be.an.instanceOf(ApiError)
      .with.property('message', 'Resource Not Found.');
  });

  it("should have message 'User Not Found.' when status is 404 and resource is 'User'.", () => {
    const err = new ApiError(404, 'User');
    expect(err)
      .to.be.an.instanceOf(ApiError)
      .with.property('message', 'User Not Found.');
  });

  it('should have custom message when some message is passed.', () => {
    const err = new ApiError(404, 'User', 'Password is invalid!');
    expect(err)
      .to.be.an.instanceOf(ApiError)
      .with.property('message', 'Password is invalid!');
  });
});
