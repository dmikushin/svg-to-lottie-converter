import express, { Request, Response, NextFunction } from "express";
import { RequestWithRawBody } from "./js/types/requests";
import services from "./js/services";
// TODO: Re-introduce the JWT auth with Auth0 here...
//import ErrorCodeTypes from "./js/constants/error-code-types";
//import jwt from "express-jwt";
//import jwksRsa from "jwks-rsa";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = "0.0.0.0";

const app = express();

// Add polyfill to add `rawBody` back into the `request` which 
// was removed in Express 4.x. You can read more about this issue
// here https://github.com/expressjs/express/issues/897
app.use((request: Request, _: Response, next: NextFunction) => {
  (request as RequestWithRawBody).rawBody = "";
  request.setEncoding("utf8");
  request.on("data", (chunk: string) => 
    (request as RequestWithRawBody).rawBody += chunk);
  request.on("end", next);
});

/***************************************
 * Unauthenticated endpoints 
 ********/

// Test endpoint
const getTestString = (request: Request, response: Response) => {
  response.status(200).json({ "test": "Successful" });
};

app.get("/test", getTestString);

/***************************************
 * Authenticated endpoints 
 ********/

// Setup JWT authentication using Auth0
/*const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: "https://prod-mdhydf16.us.auth0.com/.well-known/jwks.json"
  }),
  audience: "https://api-remove-img-bg",
  issuer: "https://prod-mdhydf16.us.auth0.com/",
  algorithms: ["RS256"]
});*/

/*const checkJwtAuthError = (
  error: Error, 
  _: Request, 
  response: Response, 
  next: NextFunction
) => {
  if (error.name === "UnauthorizedError") {
    response.status(401).send({
      success: false,
      errorCode: ErrorCodeTypes.AUTHENTICATION_FAILED,
      error: "You are not authorised to call this endpoint."
    });
  }
  next();
};*/

//app.use(checkJwt);
//app.use(checkJwtAuthError);

// Endpoints
app.post("/convert-svg-to-lottie", services.convertSvgToLottie);

/***************************************
 * Listener 
 ********/

app.listen(port, host);