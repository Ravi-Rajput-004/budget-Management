export const getRequestParams = (req) => {
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const userId = req.headers['x-user-id'];
  return { month, year, userId };
};
