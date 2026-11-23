
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (
    !authorization ||
    !/^Bearer \S+$/i.test(authorization)
  ) {
    return res.status(401).json({
      message: 'Token de autenticação ausente.',
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: 'Configuração de autenticação indisponível.',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    if (
      typeof payload !== 'object' ||
      !/^[1-9]\d*$/.test(String(payload.sub))
    ) {
      return res.status(401).json({
        message: 'Token inválido.',
      });
    }

    req.userId = Number(payload.sub);

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido ou expirado.',
    });
  }
}

module.exports = authMiddleware;
