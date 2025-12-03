// jest.setup.js
jest.mock('../middleware/upload.js', () => {
  return {
    __esModule: true,
    default: {
      single: () => (req, res, next) => next(), // mock upload.single
    },
  };
});
