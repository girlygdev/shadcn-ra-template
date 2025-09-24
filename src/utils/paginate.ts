 /**
	* Pagination helper for list functions
	*
	* @template T
	* @param {*} model
	* @param {Record<string, any>} query
	* @param {number} [page=1]
	* @param {number} [limit=10]
	* @param {Record<string, any>} [projection={}]
	* @param {Record<string, any>} [options={}]
	* @return {*}  {Promise<{ data: T[]; total: number; page: number; limit: number }>}
	*/
 const paginate = async <T>(
  model: any,
  query: Record<string, any>,
  page: number = 1,
  limit: number = 10,
  projection: Record<string, any> = {},
  options: Record<string, any> = {}
): Promise<{ data: T[]; total: number; page: number; limit: number }> => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(query, projection, options).skip(skip).limit(limit),
    model.countDocuments(query),
  ]);

  return { data, total, page, limit };
};

export default paginate;