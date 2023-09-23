# Animo Apps Node JS Web Service Wrapper for the Lottie Files SVG to Lottie Converter
An API for removing the background from images.

# Prerequisites
* You need to have `npm`, `docker` & `awscli` installed.
* You need to increase your Docker memory fromn the default 2GB to >= 4GB. 

# Building and Running the Docker Container Locally
We can build the `plays.svgtolottieconverter` Docker container locally and run the server locally to test code changes to the web service.
* Open a terminal window and change directory to the root of this repository
* Run `npm run docker:build` to build the Docker container (add `--no-cache` to prevent caching).
* Run `npm run docker:run` to run the Docker container.
* Run `npm run docker:exec` to get a bash shell in the Docker container.
* Visit `http://localhost:3000` to test the server is running.

# API Authentication
API authentication is provided by Auth0, to manage auth login to `https://manage.auth0.com/` with `info@antiblanks.com`.
* See API the "Convert SVG to Lottie JSON API" here `https://manage.auth0.com/dashboard/us/prod-mdhydf16/apis/650e695d23c7600e86690617/settings`