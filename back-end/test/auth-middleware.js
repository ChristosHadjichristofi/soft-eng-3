// the following tests authentication
// it is tested with jest

const jwt = require('jsonwebtoken');

const authMiddleware = require('../middlewares/authentication');

class Response {
  status(status) {
    this.status = status

    return this
  }

  json(data) {
    return data
  }
}

describe('Auth middleware', function () {
  // test for authHeader
  it('should throw an error if no authorization header is present', async () => {
    const req = {
      header: function(headerName) {
        return null;
      }
    };

    const res = new Response()
    const statusSpy = jest.spyOn(res, 'status')
    const jsonSpy = jest.spyOn(res, 'json')
    const next = jest.fn()

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(0)
    expect(statusSpy).toHaveBeenCalledWith(401)
    expect(jsonSpy).toHaveBeenCalledWith({
      message: 'Not authenticated.'
    })
  });
});