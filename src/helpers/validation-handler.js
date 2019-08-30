import ApiError from './ApiError';
import { validationResult } from 'express-validator';

export default function validationHandler(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const numberOfErrors = getNumberOfErrors(errors);

    const invalidParams = getInvalidParams(errors);

    const errorMessage = getErrorMessage(numberOfErrors, invalidParams);

    throw new ApiError(400, 'Validation', errorMessage);
  }

  next();
}

const getNumberOfErrors = errors => errors.array().length;

const getInvalidParams = errors =>
  errors
    .array()
    .map(err => err.param)
    .join(', ');

const getErrorMessage = (numberOfErrors, invalidParams) =>
  `${numberOfErrors > 1 ? 'Params' : 'Param'} '${invalidParams}' ${
    numberOfErrors > 1 ? 'are' : 'is'
  } invalid.`;
