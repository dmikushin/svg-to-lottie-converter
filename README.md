# Animo Apps Node JS Web Service Wrapper for the Lottie Files SVG to Lottie Converter
An API for removing the background from images.

# Prerequisites
* You need to have `npm`, `docker` & `awscli` installed.
* You need to increase your Docker memory fromn the default 2GB to >= 4GB. 

# Building and Running the Docker Container Locally
We can build the `plays.svgtolottieconverter.webservice` Docker container locally and run the server locally to test code changes to the web service.
* Open a terminal window and change directory to the root of this repository
* Run `npm run docker:build` to build the Docker container (add `--no-cache` to prevent caching).
* Run `npm run docker:run` to run the Docker container.
* Run `npm run docker:exec` to get a bash shell in the Docker container.
* Visit `http://localhost:3000` to test the server is running.

# Deploying the Docker Container to AWS 
* Open a terminal window and change directory to the root of this repository
* Run `npm run aws:deploy` to login to AWS, build and tag the Docker container and push the Docker image to the AWS repository.

# Setting up AWS to serve the API
* Open AWS and navigate to ECS (Elastic Container Services)
* Create a new Cluster with a new Task Definition
  * Use instructions here: https://dev.to/raphaelmansuy/deploy-a-docker-app-to-aws-using-ecs-3i1g
  * Note: When building the AWS server the t3.micro suggested in this guide is not sufficient to run the process to serve the site, we used the t3.large (with 8GB memory), you can find other types here: https://www.amazonaws.cn/en/ec2/instance-types/
  * Note: When specifying the "Task Memory" during creation of a new "Task Definition", the 128MB suggested in this guide is not sufficient to run the process to serve the site, we used 2GB
  * Note: When specifying the "Port" during creation of the new "Task Definition", make sure to use "0" for the "Host Port" (to allow for dynamic port mapping) and "3000" (the port we expose the Node API on) for the "Container Port"
  * Note: Check the box to enable "Auto logging" when creating the task definition so that it's easy to view logs on task containers using AWS CloudWatch 
  * Note: Enable SSH in case you need to view logs which are not exposed via CloudWatch (such as NPM logs or Node logs)
  * Note: Do not "Run Task" after creating a task definition as it suggests in this guide, the task will get ran dynamically by the ECS service that we create
* Create a new Load Balancer with a new Target Group 
  * Use instructions here: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html
  * Make sure to set up the Health Check with a valid path, using the default (AWS) "/" Health Check path is invalid and can cause unnecessary auth errors in the service, the web service has a default "/test" Health Check endpoint so you should use this instead
* Create a service on the ECS Cluster
  * Use instructions here: https://mohitshrestha02.medium.com/deploying-a-simple-hello-world-httpd-container-on-an-ecs-cluster-64c880d265f0 
  * Note: When specifiying the number of tasks use "3" (minimum "1", desired "3", maximum "3"), our instance only has 8GB available and each task requires 2GB so we cannot support running more than 3 tasks on this instance
* Route the domain to the Load Balancer
  * Use instructions here: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html

# Viewing logs on AWS CloudWatch
* Open AWS and navigate to CloudWatch
* Click on "Log groups" and click on the name of the task definition which we created in the above step
* Click on the latest "Log stream" or any of the older "Log streams" to see logs on each of the task containers

# SSH onto AWS instance
* Visit the "Connect" page in AWS for the instance, it will tell you to do something like `ssh -i "{certname}.pem" {username}@{instance id}.us-west-2.compute.amazonaws.com` and when doing this you're likely to get a timeout. To fix this add a new "Inbound rule" to the "Security Groups" associated with the instance, Type "SSH", Protocol "TCP", Port "22", and select "My IP", save the new rules and try the terminal command to SSH onto the instance again, and it should now work.

# API Authentication
API authentication is provided by Auth0, to manage auth login to `https://manage.auth0.com/` with `info@antiblanks.com`.
* See API the "Convert SVG to Lottie JSON API" here `https://manage.auth0.com/dashboard/us/prod-mdhydf16/apis/650e695d23c7600e86690617/settings`

# References
* Docker & AWS integration helped by https://dev.to/raphaelmansuy/deploy-a-docker-app-to-aws-using-ecs-3i1g
* Creating an ECS service with load balancer helped by https://mohitshrestha02.medium.com/deploying-a-simple-hello-world-httpd-container-on-an-ecs-cluster-64c880d265f0 
* Creating an ELB application load balancer helped by https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html
* Routing traffic to an Amazon EC2 instance helped by https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-ec2-instance.html
* API auth provided by https://auth0.com/, adding API auth helped by https://auth0.com/blog/node-js-and-express-tutorial-building-and-securing-restful-apis/