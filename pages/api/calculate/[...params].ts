import { add, subtract, multiply, divide } from "../../../utils/calculate";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      throw new Error(
        `Unsupported method ${req.method}. Only GET method is supported`
      );
    }

    const params = extractParams(req.query.params);
    let result: number;
    switch (params.operation) {
      case "add":
        result = add(params.first, params.second);
        break;
      case "subtract":
        result = subtract(params.first, params.second);
        break;
      case "multiply":
        result = multiply(params.first, params.second);
        break;
      case "divide":
        result = divide(params.first, params.second);
        break;
      default:
        throw new Error(`Unsupported operation ${params.operation}`);
    }
    res.status(200).json({ result });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

interface Params {
  operation: string;
  first: number;
  second: number;
}

function extractParams(queryParams: string | string[] | undefined): Params {
  if (!queryParams) {
    throw new Error(`Please provide Query params. Received ${queryParams}`);
  }

  if (Array.isArray(queryParams) && queryParams.length !== 3) {
    throw new Error(
      `Query params should have 3 items. Received ${queryParams.length}: ${queryParams}`
    );
  }

  try {
    const params = {
      operation: queryParams[0],
      first: parseInt(queryParams[1]),
      second: parseInt(queryParams[2]),
    };

    if (isNaN(params.first) || isNaN(params.second)) {
      throw new Error(`First number and Second number must be numbers`);
    }

    return params;
  } catch (e: any) {
    let errMessage = `Failed to process query params. Received: ${queryParams}`;
    if (e instanceof Error) {
      errMessage = e.message;
    }
    throw new Error(errMessage);
  }
}
