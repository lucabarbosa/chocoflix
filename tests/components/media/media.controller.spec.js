// import chai, { expect } from 'chai';
// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';

// import Media from '../../../src/components/media/media.model';

// describe('Media: Controller', () => {
//   const req = {
//     body: {
//       type: 'movie',
//       title: 'Harry Potter e a Pedra Filosofal',
//       description: 'First movie of Harry Potter',
//       filePath: '/home/lucas/harry-potter-ea-pedra-filosofal.mp4',
//       duration: 4800,
//       categories: [],
//       posters: ['/home/lucas/poster1.jpg'],
//       languages: ['pt', 'en'],
//       subtitles: [],
//       specs: {
//         sequence: []
//       }
//     }
//   };

//   const res = {};
//   const error = new Error({ error: 'Error Message' });
//   let expectedResult;

//   beforeEach(() => {
//     res.json = sinon.spy();
//     res.status = sinon.stub().returns(res);
//   });

//   describe('create() media', () => {
//     let mediaStub;
//     expectedResult = { ...req.body };

//     beforeEach(() => {
//       mediaStub = sinon.stub(Media, 'create').resolves(expectedResult);
//     });

//     afterEach(() => {
//       mediaStub.restore();
//     });

//     it('should call model with req.body', () => {
//       return MediaController.create(req, res).then(() => {
//         expect(mediaStub).to.have.been.calledWith(req.body);
//       });
//     });

//     it('should return the created object', () => {
//       return MediaController.create(req, res).then(() => {
//         expect(res.json).to.have.been.calledWith(expectedResult);
//       });
//     });

//     it('should return 201 when created', () => {
//       return MediaController.create(req, res).then(() => {
//         expect(res.status).to.have.been.calledWith(201);
//       });
//     });

//     it('should return 400 when an error occurs', () => {
//       mediaStub = mediaStub.rejects(error);

//       return MediaController.create(req, res).then(() => {
//         expect(res.status).to.have.been.calledWith(400);
//       });
//     });

//     it('should return an error if media type is movie and there isnt specs.sequence array', () => {
//       const req2 = {
//         body: {
//           type: 'movie',
//           title: 'Harry Potter e a Pedra Filosofal',
//           description: 'First movie of Harry Potter',
//           filePath: '/home/lucas/harry-potter-ea-pedra-filosofal.mp4',
//           duration: 4800,
//           categories: [],
//           posters: ['/home/lucas/poster1.jpg'],
//           languages: ['pt', 'en'],
//           subtitles: [],
//           specs: {}
//         }
//       };

//       MediaController.create(req2, res);
//       expect(res.json).to.have.been.calledWith({
//         error: 'Specs.Sequence is missing!'
//       });
//       expect(res.status).to.have.been.calledWith(400);
//     });

//     it('should return an error if media type is serie and there isnt specs.season and specs.episode', () => {
//       const req2 = {
//         body: {
//           type: 'serie',
//           title: 'Brookly 99',
//           description: 'First movie of Harry Potter',
//           filePath: '/home/lucas/harry-potter-ea-pedra-filosofal.mp4',
//           duration: 4800,
//           categories: [],
//           posters: ['/home/lucas/poster1.jpg'],
//           languages: ['pt', 'en'],
//           subtitles: [],
//           specs: {}
//         }
//       };

//       MediaController.create(req2, res);
//       expect(res.json).to.have.been.calledWith({
//         error: 'You should fill Specs.Season and Specs.Episode!'
//       });
//       expect(res.status).to.have.been.calledWith(400);
//     });
//   });
// });
